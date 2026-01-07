'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Link2,
  BarChart3,
  Clock,
  MousePointerClick,
  TrendingUp,
} from 'lucide-react';
import { BentoCard } from '@/components/ui/bento-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivityList } from '@/components/dashboard/recent-activity-list';
import { getDashboardData, type DashboardData } from '@/lib/analytics';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-zinc-800"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[350px] animate-pulse rounded-2xl bg-zinc-800" />
          <div className="h-[350px] animate-pulse rounded-2xl bg-zinc-800" />
        </div>
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

  const stats = {
    totalClicks: data?.totalClicks ?? 0,
    activeLinks: data?.activeLinks ?? 0,
    topLink: data?.topLink ?? null,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatCard
          title="Total Clicks"
          value={stats.totalClicks}
          icon={MousePointerClick}
        />
        <StatCard title="Active Links" value={stats.activeLinks} icon={Link2} />
        <StatCard
          title="Top Link"
          value={stats.topLink ? `/${stats.topLink.shortCode}` : '-'}
          icon={TrendingUp}
          subtitle={
            stats.topLink
              ? `${stats.topLink.clicks.toLocaleString()} clicks`
              : 'No data yet'
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BentoCard
          title="Analytics Overview"
          icon={<BarChart3 className="h-4 w-4" />}
          onClick={() => router.push('/dashboard/analytics')}
          className="min-h-[350px]"
        >
          <AnalyticsChart data={data?.overviews} />
        </BentoCard>

        <BentoCard
          title="Recent Activity"
          icon={<Clock className="h-4 w-4" />}
          className="min-h-[350px]"
        >
          <RecentActivityList links={data?.recentLinks} />
        </BentoCard>
      </div>
    </div>
  );
}
