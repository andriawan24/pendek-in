'use client';

import { MousePointerClick, Link2, TrendingUp, Activity } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';

interface AnalyticsStatsProps {
  totalClicks: number;
  activeLinks: number;
  topLink: { shortCode: string; clicks: number };
  avgClicksPerDay: number;
}

export function AnalyticsStats({
  totalClicks,
  activeLinks,
  topLink,
  avgClicksPerDay,
}: AnalyticsStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Clicks"
        value={totalClicks}
        icon={MousePointerClick}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Active Links"
        value={activeLinks}
        icon={Link2}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title="Top Performer"
        value={`/${topLink.shortCode}`}
        icon={TrendingUp}
        subtitle={`${topLink.clicks.toLocaleString()} clicks`}
      />
      <StatCard
        title="Avg. Clicks/Day"
        value={avgClicksPerDay}
        icon={Activity}
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  );
}
