import { SupabaseClient } from '@supabase/supabase-js';
import { Product } from '@cheerslk/shared-types';

export async function getProducts(
  client: SupabaseClient,
  options?: { page?: number; pageSize?: number; categoryId?: string }
) {
  const { page = 1, pageSize = 20, categoryId } = options ?? {};
  let query = client
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  return query;
}

export async function getProductById(client: SupabaseClient, id: string) {
  return client
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();
}

export async function getProductsByCategory(
  client: SupabaseClient,
  categoryId: string,
  options?: { page?: number; pageSize?: number }
) {
  return getProducts(client, { ...options, categoryId });
}

export async function searchProducts(
  client: SupabaseClient,
  query: string,
  options?: { page?: number; pageSize?: number }
) {
  const { page = 1, pageSize = 20 } = options ?? {};
  return client
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true)
    .or(`name_en.ilike.%${query}%,name_si.ilike.%${query}%,name_ta.ilike.%${query}%,brand.ilike.%${query}%`)
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order('created_at', { ascending: false });
}
