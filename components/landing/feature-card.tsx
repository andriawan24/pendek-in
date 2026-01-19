'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  visual,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  visual: React.ReactNode;
  delay?: number;
}): React.ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="card-tilt shadow-neo-lg group rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6"
    >
      <div className="mb-4 h-40 overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-800">
        {visual}
      </div>
      <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </motion.div>
  );
}
