import { SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';

export async function signInWithOTP(client: SupabaseClient, phone: string) {
  return client.auth.signInWithOtp({ phone });
}

export async function verifyOTP(
  client: SupabaseClient,
  phone: string,
  token: string
) {
  return client.auth.verifyOtp({ phone, token, type: 'sms' });
}

export async function signOut(client: SupabaseClient) {
  return client.auth.signOut();
}

export async function getSession(client: SupabaseClient) {
  return client.auth.getSession();
}

export function onAuthStateChange(
  client: SupabaseClient,
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return client.auth.onAuthStateChange(callback);
}
