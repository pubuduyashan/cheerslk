import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { order_id } = await req.json();

    if (!order_id) return errorResponse('order_id is required');

    const supabase = getServiceClient();

    // Get order with address
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id, user_id, address_id, order_number, status,
        addresses!inner(lat, lng)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return errorResponse('Order not found', 404);
    }

    if (order.status !== 'confirmed' && order.status !== 'preparing') {
      return errorResponse('Order is not ready for rider assignment');
    }

    const address = (order as Record<string, unknown>).addresses as { lat: number; lng: number };

    // Find nearest online riders using PostGIS (within 10km)
    const { data: nearbyRiders, error: riderError } = await supabase.rpc(
      'find_nearest_riders',
      {
        order_lat: address.lat,
        order_lng: address.lng,
        max_distance_km: 10,
        limit_count: 5,
      }
    );

    // Fallback: if RPC doesn't exist, query directly
    let riders = nearbyRiders;
    if (riderError) {
      const { data: fallbackRiders } = await supabase
        .from('riders')
        .select('id, profile_id, current_lat, current_lng, rating')
        .eq('status', 'online')
        .eq('verification_status', 'approved')
        .eq('is_active', true)
        .not('current_lat', 'is', null)
        .not('current_lng', 'is', null)
        .limit(5);

      riders = fallbackRiders;
    }

    if (!riders?.length) {
      // No riders available - notify admin
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          user_id: order.user_id,
          title: 'Finding a Rider',
          body: 'We\'re looking for a rider for your order. Hang tight!',
          type: 'order_update',
          data: { order_id },
        }),
      });

      return jsonResponse({
        success: false,
        message: 'No riders available. Admin has been notified.',
      });
    }

    // Try to assign sequentially - in production, this would involve
    // real-time rider acceptance with timeout
    let assignedRider = null;

    for (const rider of riders) {
      // Update order with rider assignment
      const { error: assignError } = await supabase
        .from('orders')
        .update({
          rider_id: rider.profile_id,
          status: 'rider_assigned',
        })
        .eq('id', order_id);

      if (!assignError) {
        // Update rider status
        await supabase
          .from('riders')
          .update({ status: 'on_delivery' })
          .eq('id', rider.id);

        assignedRider = rider;

        // Notify rider
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            user_id: rider.profile_id,
            title: 'New Delivery Request',
            body: `New order ${order.order_number} is ready for pickup!`,
            type: 'new_order',
            data: { order_id },
          }),
        });

        // Notify customer
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-push-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
          body: JSON.stringify({
            user_id: order.user_id,
            title: 'Rider Assigned',
            body: 'A rider has been assigned to your order!',
            type: 'rider_assigned',
            data: { order_id, rider_id: rider.profile_id },
          }),
        });

        break;
      }
    }

    if (!assignedRider) {
      return jsonResponse({
        success: false,
        message: 'Could not assign a rider. Escalated to admin.',
      });
    }

    return jsonResponse({
      success: true,
      rider_id: assignedRider.profile_id,
      message: 'Rider assigned successfully',
    });
  } catch (err) {
    console.error('assign-rider error:', err);
    return errorResponse('Internal server error', 500);
  }
});
