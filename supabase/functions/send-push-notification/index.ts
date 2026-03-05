import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { user_id, title, body, data, type = 'system' } = await req.json();

    if (!user_id || !title || !body) {
      return errorResponse('user_id, title, and body are required');
    }

    const supabase = getServiceClient();

    // Save notification to database
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        body,
        data,
        type,
      });

    if (insertError) {
      console.error('Failed to save notification:', insertError);
    }

    // Get user's push token
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', user_id)
      .single();

    if (!profile?.push_token) {
      return jsonResponse({
        success: true,
        push_sent: false,
        message: 'Notification saved but no push token found',
      });
    }

    // Send via Expo Push API
    const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        to: profile.push_token,
        title,
        body,
        data: data ?? {},
        sound: 'default',
        priority: 'high',
      }),
    });

    const pushResult = await pushResponse.json();

    if (pushResult.data?.status === 'error') {
      console.error('Push notification failed:', pushResult.data.message);

      // If token is invalid, clear it
      if (pushResult.data.details?.error === 'DeviceNotRegistered') {
        await supabase
          .from('profiles')
          .update({ push_token: null })
          .eq('id', user_id);
      }

      return jsonResponse({
        success: true,
        push_sent: false,
        message: 'Notification saved but push delivery failed',
      });
    }

    return jsonResponse({
      success: true,
      push_sent: true,
    });
  } catch (err) {
    console.error('send-push-notification error:', err);
    return errorResponse('Internal server error', 500);
  }
});
