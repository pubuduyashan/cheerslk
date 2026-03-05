import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    // PayHere sends form data
    const formData = await req.formData();
    const merchantId = formData.get('merchant_id') as string;
    const orderId = formData.get('order_id') as string;
    const payhereAmount = formData.get('payhere_amount') as string;
    const payhereCurrency = formData.get('payhere_currency') as string;
    const statusCode = formData.get('status_code') as string;
    const md5sig = formData.get('md5sig') as string;

    if (!merchantId || !orderId || !md5sig) {
      return errorResponse('Missing required payment parameters');
    }

    const merchantSecret = Deno.env.get('PAYHERE_MERCHANT_SECRET') ?? '';

    // Compute expected hash: MD5(merchant_id + order_id + amount + currency + status_code + MD5(merchant_secret))
    const encoder = new TextEncoder();
    const secretHashBuffer = await crypto.subtle.digest('MD5', encoder.encode(merchantSecret));
    const secretHash = Array.from(new Uint8Array(secretHashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const verifyString = `${merchantId}${orderId}${payhereAmount}${payhereCurrency}${statusCode}${secretHash}`;
    const verifyHashBuffer = await crypto.subtle.digest('MD5', encoder.encode(verifyString));
    const verifyHash = Array.from(new Uint8Array(verifyHashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    if (verifyHash !== md5sig.toUpperCase()) {
      console.error('Payment hash verification failed');
      return errorResponse('Invalid payment signature', 403);
    }

    const supabase = getServiceClient();

    // Find order by order_number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, total_amount, status')
      .eq('order_number', orderId)
      .single();

    if (orderError || !order) {
      return errorResponse('Order not found', 404);
    }

    // Status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargeback
    const statusNum = parseInt(statusCode, 10);

    if (statusNum === 2) {
      // Payment successful
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
        })
        .eq('id', order.id);

      // Award loyalty points
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-loyalty-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          user_id: order.user_id,
          order_id: order.id,
          amount: order.total_amount,
          action: 'earn',
        }),
      });

      // Trigger rider assignment
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/assign-rider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({ order_id: order.id }),
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
          title: 'Payment Confirmed',
          body: `Your order ${orderId} has been confirmed! We're preparing it now.`,
          type: 'order_update',
          data: { order_id: order.id },
        }),
      });
    } else if (statusNum === -1 || statusNum === -2) {
      // Payment failed or canceled
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          status: 'cancelled',
          cancellation_reason: 'Payment failed',
        })
        .eq('id', order.id);
    } else if (statusNum === -3) {
      // Chargeback
      await supabase
        .from('orders')
        .update({ payment_status: 'refunded', status: 'refunded' })
        .eq('id', order.id);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    console.error('verify-payment error:', err);
    return errorResponse('Internal server error', 500);
  }
});
