import type {
  AnalyticsData,
  TimeSeriesDataPoint,
  CountryData,
  ReferrerData,
  BrowserData,
  DeviceBreakdown,
} from './types';

function generateTimeSeriesData(days: number): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Create realistic patterns: weekends have less traffic
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseClicks = isWeekend ? 200 : 400;
    const variation = Math.random() * 200 - 100;

    data.push({
      date,
      clicks: Math.max(50, Math.round(baseClicks + variation)),
    });
  }

  return data;
}

function generateDeviceBreakdown(): DeviceBreakdown {
  return {
    mobile: 58,
    desktop: 35,
    tablet: 7,
  };
}

function generateCountryData(): CountryData[] {
  return [
    { name: 'United States', code: 'US', clicks: 4521, percentage: 36.3 },
    { name: 'United Kingdom', code: 'GB', clicks: 1823, percentage: 14.6 },
    { name: 'Germany', code: 'DE', clicks: 1245, percentage: 10.0 },
    { name: 'France', code: 'FR', clicks: 892, percentage: 7.2 },
    { name: 'Canada', code: 'CA', clicks: 756, percentage: 6.1 },
    { name: 'Australia', code: 'AU', clicks: 634, percentage: 5.1 },
    { name: 'Netherlands', code: 'NL', clicks: 512, percentage: 4.1 },
    { name: 'Japan', code: 'JP', clicks: 423, percentage: 3.4 },
  ];
}

function generateReferrerData(): ReferrerData[] {
  return [
    { source: 'Direct', clicks: 5234 },
    { source: 'Google', clicks: 2341 },
    { source: 'Twitter', clicks: 1823 },
    { source: 'Facebook', clicks: 1245 },
    { source: 'LinkedIn', clicks: 892 },
    { source: 'Reddit', clicks: 534 },
    { source: 'GitHub', clicks: 384 },
  ];
}

function generateBrowserData(): BrowserData[] {
  return [
    { name: 'Chrome', percentage: 62 },
    { name: 'Safari', percentage: 21 },
    { name: 'Firefox', percentage: 9 },
    { name: 'Edge', percentage: 5 },
    { name: 'Other', percentage: 3 },
  ];
}

export async function getAnalyticsData(
  dateRange: string = '30d'
): Promise<AnalyticsData> {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 100));

  const days =
    dateRange === '7d'
      ? 7
      : dateRange === '30d'
        ? 30
        : dateRange === '90d'
          ? 90
          : 365;

  const timeSeries = generateTimeSeriesData(days);
  const totalClicks = timeSeries.reduce((sum, d) => sum + d.clicks, 0);

  return {
    summary: {
      totalClicks,
      activeLinks: 42,
      topLink: { shortCode: 'abc123', clicks: 2341 },
      avgClicksPerDay: Math.round(totalClicks / days),
    },
    timeSeries,
    devices: generateDeviceBreakdown(),
    countries: generateCountryData(),
    referrers: generateReferrerData(),
    browsers: generateBrowserData(),
  };
}

export { generateTimeSeriesData };
