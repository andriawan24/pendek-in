'use client';

import { motion } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Share2 } from 'lucide-react';
import type { ReferrerData } from '@/lib/mock-data/types';

interface ReferrerSourcesProps {
  data: ReferrerData[];
}

export function ReferrerSources({ data }: ReferrerSourcesProps) {
  const maxClicks = Math.max(...data.map((r) => r.clicks));
  const topReferrers = data.slice(0, 5);

  return (
    <BentoCard title="Traffic Sources" icon={<Share2 className="h-4 w-4" />}>
      <div className="space-y-4">
        {topReferrers.map((referrer, index) => {
          const percentage = (referrer.clicks / maxClicks) * 100;

          return (
            <motion.div
              key={referrer.source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">
                  {referrer.source}
                </span>
                <span className="text-sm text-zinc-400">
                  {referrer.clicks.toLocaleString()}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-periwinkle h-full rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </BentoCard>
  );
}
