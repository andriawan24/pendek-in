export interface CreateLinkRequest {
  original_url?: string;
  custom_short_code?: string;
  expired_at?: string;
}

export interface TypeValue {
  type: string;
  value: number;
}

export interface Link {
  id: string;
  original_url: string;
  short_code: string;
  custom_short_code?: string;
  expired_at?: string;
  click_count?: number;
  created_at: string;
  device_breakdowns?: TypeValue[];
  top_countries?: TypeValue[];
}
