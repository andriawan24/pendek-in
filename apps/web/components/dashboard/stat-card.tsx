'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6',
        onClick && 'hover:shadow-neo-sm-hover cursor-pointer transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-zinc-800 p-2">
          <Icon className="text-periwinkle h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-green-500' : 'text-salmon'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-zinc-400">{title}</p>
      <p className="mt-1 text-3xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
    </motion.div>
  );
}
