import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToOrder(
  client: SupabaseClient,
  orderId: string,
  callback: (payload: { new: Record<string, unknown> }) => void
): RealtimeChannel {
  return client
    .channel(`order:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToRiderLocation(
  client: SupabaseClient,
  riderId: string,
  callback: (payload: { new: Record<string, unknown> }) => void
): RealtimeChannel {
  return client
    .channel(`rider-location:${riderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'riders',
        filter: `id=eq.${riderId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToNewOrders(
  client: SupabaseClient,
  callback: (payload: { new: Record<string, unknown> }) => void
): RealtimeChannel {
  return client
    .channel('new-orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      callback
    )
    .subscribe();
}
