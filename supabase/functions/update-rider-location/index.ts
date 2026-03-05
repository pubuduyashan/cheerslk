import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient, getUserClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse('Unauthorized', 401);

    const userClient = getUserClient(authHeader);
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return errorResponse('Unauthorized', 401);

    const { lat, lng, order_id } = await req.json();

    if (lat == null || lng == null) {
      return errorResponse('lat and lng are required');
    }

    const supabase = getServiceClient();

    // Get rider record for this profile
    const { data: rider, error: riderError } = await supabase
      .from('riders')
      .select('id, status')
      .eq('profile_id', user.id)
      .single();

    if (riderError || !rider) {
      return errorResponse('Rider profile not found', 404);
    }

    // Update current location
    const { error: updateError } = await supabase
      .from('riders')
      .update({ current_lat: lat, current_lng: lng })
      .eq('id', rider.id);

    if (updateError) {
      return errorResponse('Failed to update location', 500);
    }

    // Log to history if on active delivery
    if (rider.status === 'on_delivery') {
      await supabase
        .from('rider_location_history')
        .insert({
          rider_id: rider.id,
          order_id: order_id ?? null,
          lat,
          lng,
        });
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('update-rider-location error:', err);
    return errorResponse('Internal server error', 500);
  }
});
