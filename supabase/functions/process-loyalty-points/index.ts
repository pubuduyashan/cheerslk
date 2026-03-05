import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

// Tier multipliers for earning points
const TIER_MULTIPLIERS: Record<string, number> = {
  bronze: 1.0,
  silver: 1.25,
  gold: 1.5,
  platinum: 2.0,
};

serve(async (req) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const { user_id, order_id, amount, action, points_to_redeem } = await req.json();

    if (!user_id) return errorResponse('user_id is required');

    const supabase = getServiceClient();

    // Get or create loyalty account
    let { data: account, error: accountError } = await supabase
      .from('loyalty_accounts')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (accountError || !account) {
      // Create new loyalty account
      const { data: newAccount, error: createError } = await supabase
        .from('loyalty_accounts')
        .insert({ user_id })
        .select()
        .single();

      if (createError || !newAccount) {
        return errorResponse('Failed to create loyalty account', 500);
      }
      account = newAccount;
    }

    if (action === 'earn') {
      if (!amount || !order_id) {
        return errorResponse('amount and order_id required for earning points');
      }

      // Calculate points: 1 point per 10 LKR * tier multiplier
      const multiplier = TIER_MULTIPLIERS[account.tier] ?? 1.0;
      const basePoints = Math.floor(amount / 10);
      const earnedPoints = Math.floor(basePoints * multiplier);

      // Update balance
      const { error: updateError } = await supabase
        .from('loyalty_accounts')
        .update({
          points_balance: account.points_balance + earnedPoints,
          lifetime_points: account.lifetime_points + earnedPoints,
        })
        .eq('id', account.id);

      if (updateError) {
        return errorResponse('Failed to award points', 500);
      }

      // Record transaction
      await supabase.from('loyalty_transactions').insert({
        account_id: account.id,
        order_id,
        points: earnedPoints,
        type: 'earned',
        description: `Earned ${earnedPoints} points for order (${multiplier}x ${account.tier} multiplier)`,
      });

      // Update the order with earned points
      await supabase
        .from('orders')
        .update({ loyalty_points_earned: earnedPoints })
        .eq('id', order_id);

      return jsonResponse({
        success: true,
        points_earned: earnedPoints,
        new_balance: account.points_balance + earnedPoints,
        tier: account.tier,
        multiplier,
      });
    }

    if (action === 'redeem') {
      if (!points_to_redeem || !order_id) {
        return errorResponse('points_to_redeem and order_id required for redemption');
      }

      if (points_to_redeem > account.points_balance) {
        return errorResponse('Insufficient points balance');
      }

      // 100 points = 1 LKR
      const discountAmount = Math.floor(points_to_redeem / 100);

      const { error: updateError } = await supabase
        .from('loyalty_accounts')
        .update({
          points_balance: account.points_balance - points_to_redeem,
        })
        .eq('id', account.id);

      if (updateError) {
        return errorResponse('Failed to redeem points', 500);
      }

      await supabase.from('loyalty_transactions').insert({
        account_id: account.id,
        order_id,
        points: -points_to_redeem,
        type: 'redeemed',
        description: `Redeemed ${points_to_redeem} points for LKR ${discountAmount} discount`,
      });

      return jsonResponse({
        success: true,
        points_redeemed: points_to_redeem,
        discount_amount: discountAmount,
        new_balance: account.points_balance - points_to_redeem,
      });
    }

    return errorResponse('Invalid action. Use "earn" or "redeem".');
  } catch (err) {
    console.error('process-loyalty-points error:', err);
    return errorResponse('Internal server error', 500);
  }
});
