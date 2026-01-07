'use client';

import { MousePointerClick, Link2, TrendingUp, Activity } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';

interface AnalyticsStatsProps {
  totalClicks: number;
  activeLinks: number;
  topLink: { shortCode: string; clicks: number } | null;
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
      />
      <StatCard title="Active Links" value={activeLinks} icon={Link2} />
      <StatCard
        title="Top Performer"
        value={topLink ? `/${topLink.shortCode}` : '-'}
        icon={TrendingUp}
        subtitle={
          topLink ? `${topLink.clicks.toLocaleString()} clicks` : 'No data yet'
        }
      />
      <StatCard
        title="Avg. Clicks/Day"
        value={avgClicksPerDay}
        icon={Activity}
      />
    </div>
  );
}
