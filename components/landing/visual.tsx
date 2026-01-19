import React from 'react';
import { motion } from 'motion/react';

export function MiniChartVisual(): React.ReactNode {
  const bars = [40, 65, 45, 80, 55, 90, 70];

  return (
    <div className="flex h-full items-end justify-around gap-2 p-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-electric-yellow w-6 rounded-t"
        />
      ))}
    </div>
  );
}

export function QRCodeVisual(): React.ReactNode {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        viewport={{ once: true }}
        className="grid grid-cols-5 gap-1"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-5 w-5 rounded-sm ${
              [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                ? 'bg-electric-yellow'
                : 'bg-zinc-700'
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}

export function GlobeVisual(): React.ReactNode {
  return (
    <div className="relative flex h-full items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="border-electric-yellow/30 relative h-24 w-24 rounded-full border-2"
      >
        <div className="border-electric-yellow/30 absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 border-t-2" />
        <div className="border-electric-yellow/30 absolute inset-x-4 top-1/4 h-12 rounded-full border-2" />
      </motion.div>
      {/* Ping markers */}
      <motion.div
        className="bg-electric-yellow absolute top-6 left-1/4 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="bg-cyan absolute right-1/4 bottom-8 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="bg-hot-pink absolute top-1/2 right-8 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
