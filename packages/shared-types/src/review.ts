import { Timestamps } from './common';

export interface Review extends Timestamps {
  id: string;
  order_id: string;
  user_id: string;
  rider_id?: string;
  product_id?: string;
  delivery_rating: number;
  rider_rating?: number;
  product_rating?: number;
  comment?: string;
}
