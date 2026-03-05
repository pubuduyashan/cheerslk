import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseClient(
  url: string,
  anonKey: string
): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}

export function createSupabaseServiceClient(
  url: string,
  serviceRoleKey: string
): SupabaseClient {
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
