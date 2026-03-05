import { useState, useEffect, useRef } from 'react';
import { supabase } from './useSupabase';
import type { Order } from '@cheerslk/shared-types';

interface RiderLocation {
  lat: number;
  lng: number;
  heading?: number;
  timestamp: string;
}

export function useRealtimeOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // Fetch initial order
    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*)), address:addresses(*)')
        .eq('id', orderId)
        .single();

      if (!error && data) {
        setOrder(data as Order);
      }
    }
    fetchOrder();

    // Subscribe to order changes
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => prev ? { ...prev, ...payload.new } as Order : null);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rider_location_history',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const loc = payload.new;
          setRiderLocation({
            lat: loc.lat,
            lng: loc.lng,
            heading: loc.heading,
            timestamp: loc.created_at,
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [orderId]);

  return { order, riderLocation };
}
