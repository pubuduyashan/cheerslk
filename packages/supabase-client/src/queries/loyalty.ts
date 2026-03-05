import { SupabaseClient } from '@supabase/supabase-js';

export async function getLoyaltyAccount(
  client: SupabaseClient,
  userId: string
) {
  return client
    .from('loyalty_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();
}

export async function getLoyaltyTransactions(
  client: SupabaseClient,
  accountId: string,
  options?: { page?: number; pageSize?: number }
) {
  const { page = 1, pageSize = 20 } = options ?? {};
  return client
    .from('loyalty_transactions')
    .select('*', { count: 'exact' })
    .eq('account_id', accountId)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });
}
