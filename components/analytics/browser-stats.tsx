'use client';

import { motion } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Chrome } from 'lucide-react';
import type { BrowserData } from '@/lib/mock-data/types';

interface BrowserStatsProps {
  data: BrowserData[];
}

const browserColors: Record<string, string> = {
  Chrome: 'bg-electric-yellow',
  Safari: 'bg-periwinkle',
  Firefox: 'bg-salmon',
  Edge: 'bg-green-500',
  Other: 'bg-zinc-500',
};

export function BrowserStats({ data }: BrowserStatsProps) {
  return (
    <BentoCard title="Browser Usage" icon={<Chrome className="h-4 w-4" />}>
      <div className="space-y-4">
        {data.map((browser, index) => (
          <motion.div
            key={browser.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{browser.name}</span>
              <span className="text-sm text-zinc-400">
                {browser.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${browser.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full rounded-full ${browserColors[browser.name] || 'bg-zinc-500'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
}
