export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface LocalizedString {
  en: string;
  si: string;
  ta: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface LatLng {
  lat: number;
  lng: number;
}
