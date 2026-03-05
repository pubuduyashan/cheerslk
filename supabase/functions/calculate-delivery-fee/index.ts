import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

// Store location (CheersLK warehouse in Colombo)
const STORE_LAT = 6.9271;
const STORE_LNG = 79.8612;

function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { lat, lng, subtotal } = await req.json();

    if (lat == null || lng == null) {
      return errorResponse('lat and lng are required');
    }

    const supabase = getServiceClient();

    // Find which delivery zone contains this point using ST_Contains
    const { data: zones, error: zoneError } = await supabase.rpc(
      'find_delivery_zone',
      { point_lat: lat, point_lng: lng }
    );

    let zone = zones?.[0];

    // Fallback: if RPC doesn't exist, query zones directly
    if (zoneError || !zone) {
      const { data: allZones } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('is_active', true);

      // Use the first active zone as fallback
      zone = allZones?.[0];
    }

    if (!zone) {
      return errorResponse('Delivery is not available in your area', 422);
    }

    // Calculate distance from store
    const distanceKm = haversineDistance(STORE_LAT, STORE_LNG, lat, lng);

    // Calculate fee
    let deliveryFee = zone.base_delivery_fee + zone.per_km_fee * distanceKm;
    deliveryFee = Math.round(deliveryFee * 100) / 100;

    // Check free delivery threshold
    const isFreeDelivery =
      zone.free_delivery_threshold != null &&
      subtotal != null &&
      subtotal >= zone.free_delivery_threshold;

    return jsonResponse({
      delivery_fee: isFreeDelivery ? 0 : deliveryFee,
      distance_km: Math.round(distanceKm * 10) / 10,
      zone_name: zone.name,
      min_order_amount: zone.min_order_amount,
      free_delivery_threshold: zone.free_delivery_threshold,
      is_free_delivery: isFreeDelivery,
    });
  } catch (err) {
    console.error('calculate-delivery-fee error:', err);
    return errorResponse('Internal server error', 500);
  }
});
