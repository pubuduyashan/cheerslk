import { Timestamps } from './common';

export interface OperatingHours {
  day: number; // 0-6 (Sunday-Saturday)
  open: string; // "09:00"
  close: string; // "22:00"
  is_closed: boolean;
}

export interface DeliveryZone extends Timestamps {
  id: string;
  name: string;
  polygon: any; // GeoJSON polygon
  base_delivery_fee: number;
  per_km_fee: number;
  min_order_amount: number;
  free_delivery_threshold?: number;
  operating_hours: OperatingHours[];
  is_active: boolean;
}

export interface DeliveryFeeResult {
  fee: number;
  distance_km: number;
  zone_name: string;
  is_free: boolean;
}
