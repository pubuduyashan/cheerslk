import { SupabaseClient } from '@supabase/supabase-js';

export async function getCategories(client: SupabaseClient) {
  return client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
}

export async function getCategoryBySlug(client: SupabaseClient, slug: string) {
  return client
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
}
