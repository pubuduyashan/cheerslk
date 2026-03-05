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

    const {
      items, // Array<{ product_id: string, quantity: number }>
      address_id,
      delivery_type = 'immediate',
      scheduled_delivery_at,
      payment_method = 'payhere',
      promo_code,
      loyalty_points_to_use = 0,
      special_instructions,
    } = await req.json();

    if (!items?.length || !address_id) {
      return errorResponse('Items and address_id are required');
    }

    const supabase = getServiceClient();

    // Validate stock and get product details
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, price, stock_quantity, name_en, status, max_per_order')
      .in('id', productIds);

    if (prodError || !products) {
      return errorResponse('Failed to fetch products', 500);
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate each item
    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) return errorResponse(`Product ${item.product_id} not found`);
      if (product.status !== 'active') return errorResponse(`${product.name_en} is not available`);
      if (item.quantity > product.stock_quantity) {
        return errorResponse(`${product.name_en} only has ${product.stock_quantity} in stock`);
      }
      if (item.quantity > product.max_per_order) {
        return errorResponse(`${product.name_en} max ${product.max_per_order} per order`);
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = items.map((item: { product_id: string; quantity: number }) => {
      const product = productMap.get(item.product_id)!;
      const totalPrice = product.price * item.quantity;
      subtotal += totalPrice;
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: totalPrice,
      };
    });

    // Apply promo code
    let discount = 0;
    let promoCodeId = null;
    let deliveryFeeDiscount = false;

    if (promo_code) {
      const promoRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/apply-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          code: promo_code,
          user_id: user.id,
          subtotal,
        }),
      });

      const promoData = await promoRes.json();
      if (promoData.error) return errorResponse(promoData.error);

      discount = promoData.discount ?? 0;
      promoCodeId = promoData.promo_code_id;
      deliveryFeeDiscount = promoData.free_delivery ?? false;
    }

    // Calculate delivery fee
    const { data: address } = await supabase
      .from('addresses')
      .select('lat, lng')
      .eq('id', address_id)
      .single();

    if (!address) return errorResponse('Address not found');

    let deliveryFee = 250;
    const feeRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-delivery-fee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      },
      body: JSON.stringify({ lat: address.lat, lng: address.lng, subtotal }),
    });
    const feeData = await feeRes.json();
    if (!feeData.error) {
      deliveryFee = feeData.delivery_fee;
    }

    if (deliveryFeeDiscount) deliveryFee = 0;

    // Apply loyalty points
    let loyaltyDiscount = 0;
    if (loyalty_points_to_use > 0) {
      const { data: loyaltyAccount } = await supabase
        .from('loyalty_accounts')
        .select('points_balance')
        .eq('user_id', user.id)
        .single();

      if (loyaltyAccount && loyaltyAccount.points_balance >= loyalty_points_to_use) {
        loyaltyDiscount = Math.floor(loyalty_points_to_use / 100); // 100 pts = 1 LKR
      }
    }

    const totalAmount = Math.max(0, subtotal + deliveryFee - discount - loyaltyDiscount);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        address_id,
        status: 'pending',
        delivery_type,
        scheduled_delivery_at,
        subtotal,
        delivery_fee: deliveryFee,
        discount: discount + loyaltyDiscount,
        total_amount: totalAmount,
        payment_method,
        promo_code_id: promoCodeId,
        loyalty_points_used: loyalty_points_to_use,
        special_instructions,
      })
      .select()
      .single();

    if (orderError || !order) {
      return errorResponse('Failed to create order', 500);
    }

    // Create order items
    const itemsWithOrderId = orderItems.map((item: Record<string, unknown>) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id);
      return errorResponse('Failed to create order items', 500);
    }

    // Decrement stock
    for (const item of items) {
      const product = productMap.get(item.product_id)!;
      await supabase
        .from('products')
        .update({ stock_quantity: product.stock_quantity - item.quantity })
        .eq('id', item.product_id);
    }

    // Record promo usage
    if (promoCodeId) {
      await supabase.from('promo_code_usage').insert({
        promo_code_id: promoCodeId,
        user_id: user.id,
        order_id: order.id,
      });
      await supabase.rpc('increment_promo_uses', { promo_id: promoCodeId });
    }

    // Generate PayHere payment params if not COD
    let paymentParams = null;
    if (payment_method === 'payhere') {
      const merchantId = Deno.env.get('PAYHERE_MERCHANT_ID') ?? '';
      const merchantSecret = Deno.env.get('PAYHERE_MERCHANT_SECRET') ?? '';

      // Generate MD5 hash
      const encoder = new TextEncoder();
      const hashInput = `${merchantId}${order.order_number}${totalAmount.toFixed(2)}LKR${merchantSecret}`;
      const hashBuffer = await crypto.subtle.digest('MD5', encoder.encode(hashInput));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      paymentParams = {
        merchant_id: merchantId,
        order_id: order.order_number,
        amount: totalAmount.toFixed(2),
        currency: 'LKR',
        hash: hash.toUpperCase(),
        return_url: `cheerslk://order/${order.id}/success`,
        cancel_url: `cheerslk://order/${order.id}/cancel`,
        notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment`,
      };
    }

    return jsonResponse({
      order_id: order.id,
      order_number: order.order_number,
      total_amount: totalAmount,
      payment_method,
      payment_params: paymentParams,
    });
  } catch (err) {
    console.error('place-order error:', err);
    return errorResponse('Internal server error', 500);
  }
});
