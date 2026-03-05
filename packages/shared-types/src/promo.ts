import { Timestamps } from './common';

export type PromoType = 'percentage' | 'fixed' | 'free_delivery';

export interface PromoCode extends Timestamps {
  id: string;
  code: string;
  type: PromoType;
  discount_value: number;
  max_discount?: number;
  min_order_amount: number;
  valid_from: string;
  valid_until: string;
  max_uses: number;
  max_uses_per_user: number;
  applicable_categories?: string[];
  is_active: boolean;
  current_uses: number;
}

export interface PromoCodeUsage {
  id: string;
  promo_code_id: string;
  user_id: string;
  order_id: string;
  created_at: string;
}

export interface PromoValidationResult {
  valid: boolean;
  discount: number;
  error?: string;
}
