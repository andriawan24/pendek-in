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
import { CreateLinkForm } from '@/components/dashboard/create-link-form';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivityList } from '@/components/dashboard/recent-activity-list';

// Mock stats data - replace with actual data fetching later
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
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clicks"
          value={mockStats.totalClicks}
          icon={MousePointerClick}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Links"
          value={mockStats.activeLinks}
          icon={Link2}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Top Link"
          value={`/${mockStats.topLink.shortCode}`}
          icon={TrendingUp}
          subtitle={`${mockStats.topLink.clicks.toLocaleString()} clicks`}
        />

        {/* Create Link Card */}
        <BentoCard title="Create Link" icon={<Link2 className="h-4 w-4" />}>
          <CreateLinkForm />
        </BentoCard>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Analytics Chart */}
        <BentoCard
          title="Analytics Overview"
          icon={<BarChart3 className="h-4 w-4" />}
          onClick={() => router.push('/dashboard/analytics')}
          className="min-h-[350px]"
        >
          <AnalyticsChart />
        </BentoCard>

        {/* Recent Activity */}
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
