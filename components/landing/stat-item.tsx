import React from 'react';
import { AnimatedCounter } from './animated-counter';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
}

export default function StatItem({
  value,
  label,
  suffix = '',
}: StatItemProps): React.ReactNode {
  return (
    <div className="text-center">
      <div className="text-electric-yellow text-3xl font-bold sm:text-4xl">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-xs tracking-wider text-zinc-500 uppercase">
        {label}
      </div>
    </div>
  );
}
