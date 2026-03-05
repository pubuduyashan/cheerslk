import { useState, useEffect, useCallback } from 'react';
import { supabase } from './useSupabase';
import { useAuthStore } from '@/stores/authStore';
import type { Order } from '@cheerslk/shared-types';

export function useOrders(filter: 'active' | 'past' = 'active') {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const activeStatuses = ['pending', 'paid', 'confirmed', 'preparing', 'rider_assigned', 'picked_up', 'in_transit'];
  const pastStatuses = ['delivered', 'cancelled', 'refunded'];

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const statuses = filter === 'active' ? activeStatuses : pastStatuses;
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*, product:products(*))')
        .eq('user_id', user.id)
        .in('status', statuses)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as Order[]) || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*, product:products(*)), address:addresses(*)')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (orderId) fetch();
  }, [orderId]);

  return { order, loading };
}
