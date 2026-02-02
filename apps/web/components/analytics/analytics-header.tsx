'use client';

import { BarChart3 } from 'lucide-react';
import { DateRangeSelector } from './date-range-selector';

interface AnalyticsHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

export function AnalyticsHeader({
  dateRange,
  onDateRangeChange,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-zinc-800 p-2">
          <BarChart3 className="text-periwinkle h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
            Analytics
          </h1>
          <p className="text-sm text-zinc-400">
            Track your link performance and engagement
          </p>
        </div>
      </div>
      <DateRangeSelector value={dateRange} onChange={onDateRangeChange} />
    </div>
  );
}
