import { Timestamps } from './common';
import { Profile } from './user';

export type RiderStatus = 'offline' | 'online' | 'on_delivery';
export type VehicleType = 'motorcycle' | 'bicycle' | 'three_wheeler' | 'car';
export type RiderVerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Rider extends Timestamps {
  id: string;
  profile_id: string;
  profile?: Profile;
  vehicle_type: VehicleType;
  vehicle_number: string;
  license_number: string;
  license_image?: string;
  nic_front_image?: string;
  nic_back_image?: string;
  delivery_zone_id?: string;
  current_lat?: number;
  current_lng?: number;
  status: RiderStatus;
  verification_status: RiderVerificationStatus;
  rating: number;
  total_deliveries: number;
  commission_rate: number;
  is_active: boolean;
}

export interface RiderLocationHistory {
  id: string;
  rider_id: string;
  order_id?: string;
  lat: number;
  lng: number;
  timestamp: string;
}
