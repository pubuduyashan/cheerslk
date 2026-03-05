import { SupabaseClient } from '@supabase/supabase-js';
import { AgeVerificationStatus } from '@cheerslk/shared-types';

export async function getProfile(client: SupabaseClient, userId: string) {
  return client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  data: {
    full_name?: string;
    email?: string;
    preferred_language?: 'en' | 'si' | 'ta';
    push_token?: string;
    avatar_url?: string;
  }
) {
  return client
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();
}

export async function updateAgeVerification(
  client: SupabaseClient,
  userId: string,
  data: {
    nic_number: string;
    nic_front_image: string;
    nic_back_image: string;
    date_of_birth: string;
    age_verification_status?: AgeVerificationStatus;
  }
) {
  return client
    .from('profiles')
    .update({
      ...data,
      age_verification_status: data.age_verification_status ?? 'pending',
    })
    .eq('id', userId)
    .select()
    .single();
}
