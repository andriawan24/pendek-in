'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function BentoCard({
  children,
  className,
  title,
  icon,
  onClick,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8',
        'shadow-neo-md',
        onClick && 'hover:shadow-neo-sm-hover cursor-pointer transition-shadow',
        className
      )}
    >
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {icon && <span className="text-zinc-400">{icon}</span>}
          <h3 className="text-sm font-bold tracking-wide text-zinc-400 uppercase">
            {title}
          </h3>
        </div>
      )}
      {children}
    </motion.div>
  );
}
