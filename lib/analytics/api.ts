import {
  getAnalyticsApi,
  ResponseError,
  AnalyticsGetRangeEnum,
  ResponsesTypeValue,
  ResponsesAnalyticOverview,
} from '../api-client/client';
import { withTokenRefresh, AuthApiError } from '../auth/api';

// Types for analytics data
export interface AnalyticsSummary {
  totalClicks: number;
  activeLinks: number;
  topLink: {
    shortCode: string;
    clicks: number;
  } | null;
  avgClicksPerDay: number;
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

export interface AnalyticsData {
  summary: AnalyticsSummary;
  timeSeries: TimeSeriesDataPoint[];
  devices: DeviceBreakdown;
  countries: CountryData[];
  referrers: ReferrerData[];
  browsers: BrowserData[];
}

export interface DashboardData {
  totalClicks: number;
  activeLinks: number;
  topLink: {
    shortCode: string;
    clicks: number;
  } | null;
  recentLinks: Array<{
    id: string;
    shortCode: string;
    originalUrl: string;
    clicks: number;
    createdAt: string;
  }>;
  overviews: TimeSeriesDataPoint[];
}

/**
 * Handle API errors
 */
async function handleApiError(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    let errorMessage = `Request failed with status ${error.response.status}`;
    let errorData: unknown;

    try {
      errorData = await error.response.json();
      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
      ) {
        errorMessage = String((errorData as { message: string }).message);
      }
    } catch {
      errorMessage = error.response.statusText || errorMessage;
    }

    throw new AuthApiError(errorMessage, error.response.status, errorData);
  }

  if (error instanceof Error) {
    throw new AuthApiError(error.message);
  }

  throw new AuthApiError('Unknown error occurred');
}

/**
 * Map date range string to API enum
 */
function mapDateRange(range: string): AnalyticsGetRangeEnum {
  switch (range) {
    case '7d':
      return AnalyticsGetRangeEnum._7d;
    case '30d':
      return AnalyticsGetRangeEnum._30d;
    case '90d':
      return AnalyticsGetRangeEnum._90d;
    case 'all':
      return AnalyticsGetRangeEnum.All;
    default:
      return AnalyticsGetRangeEnum._30d;
  }
}

/**
 * Parse device breakdowns from API response
 */
function parseDeviceBreakdown(
  devices: ResponsesTypeValue[] | undefined
): DeviceBreakdown {
  const result: DeviceBreakdown = { mobile: 0, desktop: 0, tablet: 0 };

  if (!devices) return result;

  for (const device of devices) {
    const type = device.type?.toLowerCase() ?? '';
    const value = device.value ?? 0;

    if (type.includes('mobile') || type.includes('phone')) {
      result.mobile = value;
    } else if (type.includes('desktop')) {
      result.desktop = value;
    } else if (type.includes('tablet')) {
      result.tablet = value;
    }
  }

  // Calculate percentages if values are counts
  const total = result.mobile + result.desktop + result.tablet;
  if (total > 100) {
    result.mobile = Math.round((result.mobile / total) * 100);
    result.desktop = Math.round((result.desktop / total) * 100);
    result.tablet = Math.round((result.tablet / total) * 100);
  }

  return result;
}

/**
 * Parse country data from API response
 */
function parseCountryData(
  countries: ResponsesTypeValue[] | undefined,
  totalClicks: number
): CountryData[] {
  if (!countries) return [];

  return countries.map((country) => ({
    name: country.type ?? 'Unknown',
    code: country.type?.substring(0, 2).toUpperCase() ?? 'XX',
    clicks: country.value ?? 0,
    percentage:
      totalClicks > 0
        ? Math.round(((country.value ?? 0) / totalClicks) * 100 * 10) / 10
        : 0,
  }));
}

/**
 * Parse referrer data from API response
 */
function parseReferrerData(
  referrers: ResponsesTypeValue[] | undefined
): ReferrerData[] {
  if (!referrers) return [];

  return referrers.map((ref) => ({
    source: ref.type ?? 'Direct',
    clicks: ref.value ?? 0,
  }));
}

/**
 * Parse browser data from API response
 */
function parseBrowserData(
  browsers: ResponsesTypeValue[] | undefined,
  totalClicks: number
): BrowserData[] {
  if (!browsers) return [];

  return browsers.map((browser) => ({
    name: browser.type ?? 'Unknown',
    percentage:
      totalClicks > 0
        ? Math.round(((browser.value ?? 0) / totalClicks) * 100)
        : 0,
  }));
}

/**
 * Parse time series data from API response
 */
function parseTimeSeries(
  overviews: ResponsesAnalyticOverview[] | undefined
): TimeSeriesDataPoint[] {
  if (!overviews) return [];

  return overviews.map((overview) => ({
    date: overview.date ? new Date(overview.date) : new Date(),
    clicks: overview.value ?? 0,
  }));
}

/**
 * Get detailed analytics data
 */
export async function getAnalyticsData(
  dateRange: string = '30d'
): Promise<AnalyticsData> {
  return withTokenRefresh(async () => {
    try {
      const analyticsApi = getAnalyticsApi();
      const response = await analyticsApi.analyticsGet({
        range: mapDateRange(dateRange),
      });

      const data = response.data;
      if (!data) {
        throw new AuthApiError('Invalid response from server');
      }

      const totalClicks = data.totalClicks ?? 0;
      const timeSeries = parseTimeSeries(data.overviews);

      return {
        summary: {
          totalClicks,
          activeLinks: data.totalActiveLinks ?? 0,
          topLink: data.topLink?.link
            ? {
                shortCode: data.topLink.link.shortCode ?? '',
                clicks: data.topLink.totalClicks ?? 0,
              }
            : null,
          avgClicksPerDay: data.avgDailyClick ?? 0,
        },
        timeSeries,
        devices: parseDeviceBreakdown(data.deviceBreakdowns),
        countries: parseCountryData(data.topCountries, totalClicks),
        referrers: parseReferrerData(data.trafficSources),
        browsers: parseBrowserData(data.browserUsages, totalClicks),
      };
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * Get dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  return withTokenRefresh(async () => {
    try {
      const analyticsApi = getAnalyticsApi();
      const response = await analyticsApi.analyticsDashboardGet();

      const data = response.data;
      if (!data) {
        throw new AuthApiError('Invalid response from server');
      }

      return {
        totalClicks: data.totalClicks ?? 0,
        activeLinks: data.totalActiveLinks ?? 0,
        topLink: data.topLink?.link
          ? {
              shortCode: data.topLink.link.shortCode ?? '',
              clicks: data.topLink.totalClicks ?? 0,
            }
          : null,
        recentLinks: (data.recents ?? []).map((link) => ({
          id: link.id ?? '',
          shortCode: link.shortCode ?? '',
          originalUrl: link.originalUrl ?? '',
          clicks: link.clickCount ?? 0,
          createdAt: link.createdAt ?? '',
        })),
        overviews: parseTimeSeries(data.overviews),
      };
    } catch (error) {
      return handleApiError(error);
    }
  });
}
