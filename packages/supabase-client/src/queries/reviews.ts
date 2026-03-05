import { SupabaseClient } from '@supabase/supabase-js';

export async function createReview(
  client: SupabaseClient,
  review: {
    order_id: string;
    user_id: string;
    rider_id?: string;
    product_id?: string;
    delivery_rating: number;
    rider_rating?: number;
    product_rating?: number;
    comment?: string;
  }
) {
  return client
    .from('reviews')
    .insert(review)
    .select()
    .single();
}

export async function getReviewsByProduct(
  client: SupabaseClient,
  productId: string,
  options?: { page?: number; pageSize?: number }
) {
  const { page = 1, pageSize = 20 } = options ?? {};
  return client
    .from('reviews')
    .select('*, profile:profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('product_id', productId)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });
}

export async function getReviewsByOrder(
  client: SupabaseClient,
  orderId: string
) {
  return client
    .from('reviews')
    .select('*')
    .eq('order_id', orderId);
}
