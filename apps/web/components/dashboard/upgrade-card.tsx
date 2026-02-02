'use client';

import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
  QrCode,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const proFeatures = [
  { icon: InfinityIcon, label: 'Unlimited links' },
  { icon: QrCode, label: 'Custom QR codes' },
  { icon: BarChart3, label: 'Advanced analytics' },
];

export function UpgradeCard() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Blurred background decoration */}
      <div className="bg-electric-yellow/20 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-salmon/20 absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />
      <div className="bg-periwinkle/20 absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="text-electric-yellow h-6 w-6" />
          </motion.div>
          <h3 className="text-lg font-bold tracking-wide text-white uppercase">
            Go Pro
          </h3>
        </div>

        {/* Features list */}
        <ul className="mb-4 flex-1 space-y-2">
          {proFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.li
                key={feature.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-zinc-300"
              >
                <Icon className="text-periwinkle h-4 w-4" />
                {feature.label}
              </motion.li>
            );
          })}
        </ul>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">$9</span>
            <span className="text-sm text-zinc-400">/month</span>
          </div>
          <p className="text-xs text-zinc-500">or $90/year (save 17%)</p>
        </div>

        {/* CTA Button */}
        <Button variant="primary" size="md" className="w-full">
          <Zap className="h-4 w-4" />
          Upgrade Now
        </Button>
      </div>

      {/* Gradient border effect */}
      <div className="from-electric-yellow/20 to-salmon/20 absolute inset-0 -z-10 rounded-2xl bg-linear-to-br via-transparent opacity-50" />
    </div>
  );
}
