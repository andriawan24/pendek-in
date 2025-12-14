'use client';

import { motion } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import type { DeviceBreakdown as DeviceBreakdownType } from '@/lib/mock-data/types';

interface DeviceBreakdownProps {
  data: DeviceBreakdownType;
}

const deviceConfig = {
  mobile: {
    icon: Smartphone,
    label: 'Mobile',
    color: 'bg-electric-yellow',
    textColor: 'text-electric-yellow',
  },
  desktop: {
    icon: Monitor,
    label: 'Desktop',
    color: 'bg-periwinkle',
    textColor: 'text-periwinkle',
  },
  tablet: {
    icon: Tablet,
    label: 'Tablet',
    color: 'bg-salmon',
    textColor: 'text-salmon',
  },
};

export function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  const devices = [
    { key: 'mobile' as const, value: data.mobile },
    { key: 'desktop' as const, value: data.desktop },
    { key: 'tablet' as const, value: data.tablet },
  ];

  return (
    <BentoCard title="Device Breakdown" icon={<Monitor className="h-4 w-4" />}>
      <div className="space-y-6">
        {devices.map((device, index) => {
          const config = deviceConfig[device.key];
          const Icon = config.icon;

          return (
            <motion.div
              key={device.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-zinc-800 p-2">
                    <Icon className={`h-4 w-4 ${config.textColor}`} />
                  </div>
                  <span className="font-medium text-white">{config.label}</span>
                </div>
                <span className={`text-lg font-bold ${config.textColor}`}>
                  {device.value}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${device.value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${config.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </BentoCard>
  );
}
