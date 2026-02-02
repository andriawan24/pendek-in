'use client';

import { useInView } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({
  target,
  suffix = '',
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}): React.ReactNode {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="counter-number">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
