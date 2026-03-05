import { Timestamps } from './common';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type LoyaltyTransactionType = 'earned' | 'redeemed' | 'expired' | 'bonus';

export interface LoyaltyAccount extends Timestamps {
  id: string;
  user_id: string;
  points_balance: number;
  tier: LoyaltyTier;
  lifetime_points: number;
}

export interface LoyaltyTransaction extends Timestamps {
  id: string;
  account_id: string;
  order_id?: string;
  points: number;
  type: LoyaltyTransactionType;
  description: string;
}

export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 15000,
};

export const TIER_MULTIPLIERS: Record<LoyaltyTier, number> = {
  bronze: 1,
  silver: 1.5,
  gold: 2,
  platinum: 3,
};
