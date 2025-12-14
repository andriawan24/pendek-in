'use client';

import { useState, useEffect } from 'react';
import { AnalyticsHeader } from '@/components/analytics/analytics-header';
import { AnalyticsStats } from '@/components/analytics/analytics-stats';
import { AnalyticsTimeChart } from '@/components/analytics/analytics-time-chart';
import { DeviceBreakdown } from '@/components/analytics/device-breakdown';
import { GeographicData } from '@/components/analytics/geographic-data';
import { ReferrerSources } from '@/components/analytics/referrer-sources';
import { BrowserStats } from '@/components/analytics/browser-stats';
import { getAnalyticsData } from '@/lib/mock-data/analytics';
import type { AnalyticsData } from '@/lib/mock-data/types';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const analyticsData = await getAnalyticsData(dateRange);
      setData(analyticsData);
      setIsLoading(false);
    }
    fetchData();
  }, [dateRange]);

  if (isLoading || !data) {
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
