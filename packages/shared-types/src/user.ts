import { Timestamps } from './common';

export type UserRole = 'customer' | 'rider' | 'admin';
export type AgeVerificationStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';
export type PreferredLanguage = 'en' | 'si' | 'ta';

export interface Profile extends Timestamps {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email?: string;
  nic_number?: string;
  nic_front_image?: string;
  nic_back_image?: string;
  date_of_birth?: string;
  age_verified: boolean;
  age_verification_status: AgeVerificationStatus;
  preferred_language: PreferredLanguage;
  push_token?: string;
  avatar_url?: string;
}

export interface Address extends Timestamps {
  id: string;
  user_id: string;
  label: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  special_instructions?: string;
  is_default: boolean;
}
