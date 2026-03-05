import { Timestamps } from './common';
import { Address } from './user';
import { Product } from './product';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'confirmed'
  | 'preparing'
  | 'rider_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type DeliveryType = 'immediate' | 'scheduled';
export type PaymentMethod = 'payhere' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order extends Timestamps {
  id: string;
  user_id: string;
  rider_id?: string;
  address_id: string;
  address?: Address;
  order_number: string;
  status: OrderStatus;
  delivery_type: DeliveryType;
  scheduled_delivery_at?: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  promo_code_id?: string;
  loyalty_points_used: number;
  loyalty_points_earned: number;
  special_instructions?: string;
  confirmed_at?: string;
  preparing_at?: string;
  rider_assigned_at?: string;
  picked_up_at?: string;
  in_transit_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderStatusHistory extends Timestamps {
  id: string;
  order_id: string;
  status: OrderStatus;
  changed_by: string;
  notes?: string;
}
