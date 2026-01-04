export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  linkId: string;
  timestamp: Date;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  country: string;
  countryCode: string;
  referrer: string | null;
  browser: string;
  os: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  tier: 'free' | 'pro';
  createdAt: Date;
}

export interface TimeSeriesDataPoint {
  date: Date;
  clicks: number;
}

export interface DeviceBreakdown {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface CountryData {
  name: string;
  code: string;
  clicks: number;
  percentage: number;
}

export interface ReferrerData {
  source: string;
  clicks: number;
}

export interface BrowserData {
  name: string;
  percentage: number;
}

export interface AnalyticsSummary {
  totalClicks: number;
  activeLinks: number;
  topLink: {
    shortCode: string;
    clicks: number;
  };
  avgClicksPerDay: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  timeSeries: TimeSeriesDataPoint[];
  devices: DeviceBreakdown;
  countries: CountryData[];
  referrers: ReferrerData[];
  browsers: BrowserData[];
}
