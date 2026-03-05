import { SupabaseClient } from '@supabase/supabase-js';

export async function validatePromoCode(
  client: SupabaseClient,
  code: string,
  userId: string,
  orderAmount: number
) {
  return client.rpc('validate_promo_code', {
    p_code: code,
    p_user_id: userId,
    p_order_amount: orderAmount,
  });
}

export async function getPromoCodes(
  client: SupabaseClient,
  options?: { activeOnly?: boolean }
) {
  let query = client
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.activeOnly) {
    const now = new Date().toISOString();
    query = query
      .eq('is_active', true)
      .lte('valid_from', now)
      .gte('valid_until', now);
  }

  return query;
}
