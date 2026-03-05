import { SupabaseClient } from '@supabase/supabase-js';

export async function getAddresses(client: SupabaseClient, userId: string) {
  return client
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });
}

export async function createAddress(
  client: SupabaseClient,
  address: {
    user_id: string;
    label: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    district: string;
    lat: number;
    lng: number;
    special_instructions?: string;
    is_default?: boolean;
  }
) {
  if (address.is_default) {
    await client
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', address.user_id);
  }

  return client
    .from('addresses')
    .insert(address)
    .select()
    .single();
}

export async function updateAddress(
  client: SupabaseClient,
  addressId: string,
  userId: string,
  data: {
    label?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    district?: string;
    lat?: number;
    lng?: number;
    special_instructions?: string;
    is_default?: boolean;
  }
) {
  if (data.is_default) {
    await client
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);
  }

  return client
    .from('addresses')
    .update(data)
    .eq('id', addressId)
    .eq('user_id', userId)
    .select()
    .single();
}

export async function deleteAddress(
  client: SupabaseClient,
  addressId: string,
  userId: string
) {
  return client
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);
}
