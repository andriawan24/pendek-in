import { useInView } from 'motion/react';
import React, { useRef } from 'react';
import { motion } from 'motion/react';

interface TerminalStepProps {
  step: number;
  command: string;
  output: string;
  delay: number;
}

export function TerminalStep({
  step,
  command,
  output,
  delay,
}: TerminalStepProps): React.ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="shadow-neo-md rounded-xl border-2 border-zinc-700 bg-zinc-900 p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="bg-electric-yellow text-charcoal flex h-6 w-6 items-center justify-center rounded text-xs font-bold">
          {step}
        </div>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-electric-yellow">$</span>
          <span className="text-zinc-300">{command}</span>
          <span className="animate-blink text-electric-yellow">▌</span>
        </div>
        <div className="mt-2 text-zinc-500">{output}</div>
      </div>
    </motion.div>
  );
}
