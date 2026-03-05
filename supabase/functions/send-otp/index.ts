import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { phone } = await req.json();

    if (!phone || !/^\+94\d{9}$/.test(phone)) {
      return errorResponse('Valid Sri Lankan phone number required (+94XXXXXXXXX)');
    }

    const supabase = getServiceClient();

    // Rate limit: max 5 OTPs per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('otp_codes')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone)
      .gte('created_at', oneHourAgo);

    if ((count ?? 0) >= 5) {
      return errorResponse('Too many OTP requests. Try again later.', 429);
    }

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP
    const { error: insertError } = await supabase
      .from('otp_codes')
      .insert({ phone, code, expires_at: expiresAt });

    if (insertError) {
      return errorResponse('Failed to generate OTP', 500);
    }

    // Send via notify.lk
    const apiKey = Deno.env.get('NOTIFY_LK_API_KEY');
    const userId = Deno.env.get('NOTIFY_LK_USER_ID');
    const senderId = Deno.env.get('NOTIFY_LK_SENDER_ID');

    if (apiKey && userId && senderId) {
      const smsResponse = await fetch('https://app.notify.lk/api/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          user_id: userId,
          sender_id: senderId,
          to: phone,
          message: `Your CheersLK verification code is: ${code}. Valid for 5 minutes.`,
        }),
      });

      if (!smsResponse.ok) {
        console.error('SMS send failed:', await smsResponse.text());
      }
    } else {
      // Dev mode: log OTP to console
      console.log(`[DEV] OTP for ${phone}: ${code}`);
    }

    return jsonResponse({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('send-otp error:', err);
    return errorResponse('Internal server error', 500);
  }
});
