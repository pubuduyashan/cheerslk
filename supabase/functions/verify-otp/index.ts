import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return errorResponse('Phone and code are required');
    }

    const supabase = getServiceClient();

    // Find valid OTP
    const { data: otp, error: fetchError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otp) {
      return errorResponse('No valid OTP found. Request a new one.');
    }

    // Check max attempts
    if (otp.attempts >= 3) {
      await supabase.from('otp_codes').delete().eq('id', otp.id);
      return errorResponse('Maximum attempts exceeded. Request a new OTP.');
    }

    // Verify code
    if (otp.code !== code) {
      await supabase
        .from('otp_codes')
        .update({ attempts: otp.attempts + 1 })
        .eq('id', otp.id);
      return errorResponse('Invalid OTP code');
    }

    // OTP is valid - delete it
    await supabase.from('otp_codes').delete().eq('id', otp.id);

    // Sign in or create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      phone,
      phone_confirm: true,
      user_metadata: { phone_verified: true },
    });

    // If user already exists, generate a session
    if (authError?.message?.includes('already been registered')) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users?.users?.find((u) => u.phone === phone);

      if (existingUser) {
        const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: existingUser.email || `${phone.replace('+', '')}@phone.cheerslk.com`,
        });

        // Use a direct token generation approach
        const { data: tokenData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: existingUser.email || `${phone.replace('+', '')}@phone.cheerslk.com`,
        });

        return jsonResponse({
          success: true,
          user_id: existingUser.id,
          is_new_user: false,
          message: 'Phone verified successfully',
        });
      }
    }

    if (authError) {
      return errorResponse('Authentication failed', 500);
    }

    return jsonResponse({
      success: true,
      user_id: authData.user.id,
      is_new_user: true,
      message: 'Phone verified and account created',
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    return errorResponse('Internal server error', 500);
  }
});
