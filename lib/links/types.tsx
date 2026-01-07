export interface CreateLinkRequest {
  original_url?: string;
  custom_short_code?: string;
  expired_at?: string;
}

export interface Link {
  id: string;
  original_url: string;
  short_code: string;
  custom_short_code?: string;
  expired_at?: string;
  click_count?: number;
  created_at: string;
}
