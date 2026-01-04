'use client';

import { useRouter } from 'next/navigation';
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

const mockStats = {
  totalClicks: 12453,
  activeLinks: 42,
  topLink: {
    shortCode: 'abc123',
    clicks: 2341,
  },
};

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <StatCard
          title="Total Clicks"
          value={mockStats.totalClicks}
          icon={MousePointerClick}
        />
        <StatCard
          title="Active Links"
          value={mockStats.activeLinks}
          icon={Link2}
        />
        <StatCard
          title="Top Link"
          value={`/${mockStats.topLink.shortCode}`}
          icon={TrendingUp}
          subtitle={`${mockStats.topLink.clicks.toLocaleString()} clicks`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BentoCard
          title="Analytics Overview"
          icon={<BarChart3 className="h-4 w-4" />}
          onClick={() => router.push('/dashboard/analytics')}
          className="min-h-[350px]"
        >
          <AnalyticsChart />
        </BentoCard>

        <BentoCard
          title="Recent Activity"
          icon={<Clock className="h-4 w-4" />}
          className="min-h-[350px]"
        >
          <RecentActivityList />
        </BentoCard>
      </div>
    </div>
  );
}
