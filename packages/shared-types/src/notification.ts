import { Timestamps } from './common';

export type NotificationType =
  | 'order_update'
  | 'new_order'
  | 'rider_assigned'
  | 'delivery_update'
  | 'promo'
  | 'system';

export interface Notification extends Timestamps {
  id: string;
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  type: NotificationType;
  is_read: boolean;
}

export interface OTPCode {
  id: string;
  phone: string;
  code: string;
  expires_at: string;
  attempts: number;
  created_at: string;
}
