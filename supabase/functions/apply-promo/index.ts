import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { code, user_id, subtotal, category_ids } = await req.json();

    if (!code) return errorResponse('Promo code is required');
    if (!user_id) return errorResponse('user_id is required');
    if (subtotal == null) return errorResponse('subtotal is required');

    const supabase = getServiceClient();

    // Find promo code
    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (promoError || !promo) {
      return errorResponse('Invalid promo code');
    }

    // Validate: is active
    if (!promo.is_active) {
      return errorResponse('This promo code is no longer active');
    }

    // Validate: within date range
    const now = new Date();
    if (now < new Date(promo.valid_from) || now > new Date(promo.valid_until)) {
      return errorResponse('This promo code has expired');
    }

    // Validate: max total uses
    if (promo.max_uses > 0 && promo.current_uses >= promo.max_uses) {
      return errorResponse('This promo code has reached its usage limit');
    }

    // Validate: max uses per user
    const { count: userUsageCount } = await supabase
      .from('promo_code_usage')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code_id', promo.id)
      .eq('user_id', user_id);

    if ((userUsageCount ?? 0) >= promo.max_uses_per_user) {
      return errorResponse('You have already used this promo code the maximum number of times');
    }

    // Validate: min order amount
    if (subtotal < promo.min_order_amount) {
      return errorResponse(`Minimum order amount is LKR ${promo.min_order_amount}`);
    }

    // Validate: applicable categories
    if (promo.applicable_categories?.length && category_ids?.length) {
      const hasApplicable = category_ids.some((id: string) =>
        promo.applicable_categories.includes(id)
      );
      if (!hasApplicable) {
        return errorResponse('This promo code is not applicable to your items');
      }
    }

    // Calculate discount
    let discount = 0;
    let freeDelivery = false;

    switch (promo.type) {
      case 'percentage':
        discount = (subtotal * promo.discount_value) / 100;
        if (promo.max_discount && discount > promo.max_discount) {
          discount = promo.max_discount;
        }
        break;
      case 'fixed':
        discount = Math.min(promo.discount_value, subtotal);
        break;
      case 'free_delivery':
        freeDelivery = true;
        break;
    }

    return jsonResponse({
      valid: true,
      promo_code_id: promo.id,
      type: promo.type,
      discount: Math.round(discount * 100) / 100,
      free_delivery: freeDelivery,
      message: freeDelivery
        ? 'Free delivery applied!'
        : `LKR ${discount.toFixed(2)} discount applied!`,
    });
  } catch (err) {
    console.error('apply-promo error:', err);
    return errorResponse('Internal server error', 500);
  }
});
