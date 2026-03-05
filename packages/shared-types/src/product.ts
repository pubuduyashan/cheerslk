import { LocalizedString, Timestamps } from './common';

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface Category extends Timestamps {
  id: string;
  name_en: string;
  name_si: string;
  name_ta: string;
  slug: string;
  image_url?: string;
  sort_order: number;
  parent_id?: string;
  requires_age_verification: boolean;
  is_active: boolean;
  children?: Category[];
}

export interface Product extends Timestamps {
  id: string;
  category_id: string;
  category?: Category;
  name_en: string;
  name_si: string;
  name_ta: string;
  description_en?: string;
  description_si?: string;
  description_ta?: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  images: string[];
  stock_quantity: number;
  abv?: number;
  volume_ml?: number;
  brand?: string;
  origin_country?: string;
  max_per_order: number;
  status: ProductStatus;
  is_active: boolean;
  average_rating?: number;
  review_count?: number;
}
