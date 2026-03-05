import { useEffect, useCallback } from 'react';
import { useRiderStore } from '@/stores/riderStore';
import { useAuthStore } from '@/stores/authStore';
import { createSupabaseClient } from '@cheerslk/supabase-client';
import { Order } from '@cheerslk/shared-types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function useOrderStream() {
  const { session } = useAuthStore();
  const {
    rider,
    status,
    setIncomingOrder,
    setActiveDelivery,
    setStatus,
    setCurrentStep,
  } = useRiderStore();

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  const acceptOrder = useCallback(
    async (order: Order) => {
      if (!rider) return false;
      const { error } = await supabase
        .from('orders')
        .update({
          rider_id: rider.id,
          status: 'rider_assigned',
          rider_assigned_at: new Date().toISOString(),
        })
        .eq('id', order.id)
        .eq('status', 'confirmed');

      if (!error) {
        setActiveDelivery({ ...order, status: 'rider_assigned', rider_id: rider.id });
        setIncomingOrder(null);
        setStatus('on_delivery');
        setCurrentStep(1);
        return true;
      }
      return false;
    },
    [rider]
  );

  const declineOrder = useCallback(() => {
    setIncomingOrder(null);
  }, []);

  useEffect(() => {
    if (!session || !rider || status !== 'online') return;

    const channel = supabase
      .channel('rider-orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `status=eq.confirmed`,
        },
        (payload) => {
          const order = payload.new as Order;
          if (!order.rider_id) {
            setIncomingOrder(order);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, rider, status]);

  return { acceptOrder, declineOrder };
}
