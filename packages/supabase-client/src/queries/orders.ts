import { SupabaseClient } from '@supabase/supabase-js';
import { OrderStatus } from '@cheerslk/shared-types';

export async function createOrder(
  client: SupabaseClient,
  order: {
    user_id: string;
    address_id: string;
    delivery_type: 'immediate' | 'scheduled';
    scheduled_delivery_at?: string;
    subtotal: number;
    delivery_fee: number;
    discount: number;
    total_amount: number;
    payment_method: 'payhere' | 'cash_on_delivery';
    promo_code_id?: string;
    loyalty_points_used?: number;
    special_instructions?: string;
    items: {
      product_id: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }[];
  }
) {
  const { items, ...orderData } = order;

  const { data: newOrder, error: orderError } = await client
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError || !newOrder) {
    return { data: null, error: orderError };
  }

  const orderItems = items.map((item) => ({
    ...item,
    order_id: newOrder.id,
  }));

  const { error: itemsError } = await client
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    return { data: null, error: itemsError };
  }

  return { data: newOrder, error: null };
}

export async function getOrders(
  client: SupabaseClient,
  userId: string,
  options?: { page?: number; pageSize?: number; status?: OrderStatus }
) {
  const { page = 1, pageSize = 20, status } = options ?? {};
  let query = client
    .from('orders')
    .select('*, items:order_items(*, product:products(*)), address:addresses(*)', {
      count: 'exact',
    })
    .eq('user_id', userId)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  return query;
}

export async function getOrderById(client: SupabaseClient, orderId: string) {
  return client
    .from('orders')
    .select(
      '*, items:order_items(*, product:products(*)), address:addresses(*)'
    )
    .eq('id', orderId)
    .single();
}

export async function updateOrderStatus(
  client: SupabaseClient,
  orderId: string,
  status: OrderStatus,
  changedBy: string,
  notes?: string
) {
  const timestampField = `${status}_at`;
  const update: Record<string, unknown> = {
    status,
    [timestampField]: new Date().toISOString(),
  };

  const { error: orderError } = await client
    .from('orders')
    .update(update)
    .eq('id', orderId);

  if (orderError) {
    return { data: null, error: orderError };
  }

  return client
    .from('order_status_history')
    .insert({ order_id: orderId, status, changed_by: changedBy, notes });
}
