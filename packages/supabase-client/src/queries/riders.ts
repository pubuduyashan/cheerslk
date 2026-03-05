import { SupabaseClient } from '@supabase/supabase-js';
import { RiderStatus } from '@cheerslk/shared-types';

export async function getRiders(
  client: SupabaseClient,
  options?: { status?: RiderStatus; zoneId?: string }
) {
  let query = client
    .from('riders')
    .select('*, profile:profiles(*)');

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.zoneId) {
    query = query.eq('delivery_zone_id', options.zoneId);
  }

  return query;
}

export async function getNearestRider(
  client: SupabaseClient,
  lat: number,
  lng: number,
  radiusKm: number = 10
) {
  return client.rpc('get_nearest_rider', {
    p_lat: lat,
    p_lng: lng,
    p_radius_km: radiusKm,
  });
}

export async function updateRiderLocation(
  client: SupabaseClient,
  riderId: string,
  lat: number,
  lng: number
) {
  return client
    .from('riders')
    .update({ current_lat: lat, current_lng: lng })
    .eq('id', riderId);
}

export async function updateRiderStatus(
  client: SupabaseClient,
  riderId: string,
  status: RiderStatus
) {
  return client
    .from('riders')
    .update({ status })
    .eq('id', riderId);
}
