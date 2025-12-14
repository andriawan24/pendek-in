'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { GoogleLogo } from '@/components/auth/google-logo';

export function GoogleSignInButton({
  href = '/auth/google',
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 2, y: 2 }}
      whileTap={{ x: 4, y: 4 }}
      transition={{ duration: 0.1 }}
      className={cn(
        'inline-flex w-full items-center justify-center gap-3',
        'rounded-xl border-2 border-zinc-700 bg-zinc-900 px-5 py-3',
        'font-bold tracking-wide text-white uppercase',
        'shadow-neo-md hover:shadow-neo-sm-hover hover:bg-zinc-800',
        'transition-all duration-100',
        className
      )}
    >
      <GoogleLogo className="h-5 w-5" />
      Continue with Google
    </motion.a>
  );
}
