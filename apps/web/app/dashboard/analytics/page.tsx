'use client';

import { useState, useEffect } from 'react';
import { AnalyticsHeader } from '@/components/analytics/analytics-header';
import { AnalyticsStats } from '@/components/analytics/analytics-stats';
import { AnalyticsTimeChart } from '@/components/analytics/analytics-time-chart';
import { DeviceBreakdown } from '@/components/analytics/device-breakdown';
import { GeographicData } from '@/components/analytics/geographic-data';
import { ReferrerSources } from '@/components/analytics/referrer-sources';
import { BrowserStats } from '@/components/analytics/browser-stats';
import { getAnalyticsData, type AnalyticsData } from '@/lib/analytics';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const analyticsData = await getAnalyticsData(dateRange);
        setData(analyticsData);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load analytics'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-2xl bg-zinc-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-zinc-800"
            />
          ))}
        </div>
        <div className="h-[400px] animate-pulse rounded-2xl bg-zinc-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-zinc-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-electric-yellow mt-4 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader dateRange={dateRange} onDateRangeChange={setDateRange} />

      <AnalyticsStats
        totalClicks={data.summary.totalClicks}
        activeLinks={data.summary.activeLinks}
        topLink={data.summary.topLink}
        avgClicksPerDay={data.summary.avgClicksPerDay}
      />

      <AnalyticsTimeChart data={data.timeSeries} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DeviceBreakdown data={data.devices} />
        <GeographicData data={data.countries} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReferrerSources data={data.referrers} />
        <BrowserStats data={data.browsers} />
      </div>
    </div>
  );
}
