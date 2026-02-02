import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface LandingNavbarProps {
  isAuth: boolean;
}

export function LandingNavbar({ isAuth }: LandingNavbarProps): React.ReactNode {
  return (
    <header className="flex h-20 items-center justify-between">
      <motion.a
        href="/"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Image
          className="h-8 w-8"
          src="/images/img_logo.webp"
          width={500}
          height={500}
          alt="Logo Pendek In"
        />
        <span className="text-xl font-bold tracking-tight text-white uppercase">
          Pendek In
        </span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        {isAuth ? (
          <Link
            href="/dashboard"
            className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover animate-pulse-glow inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-100"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="link-underline hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover animate-pulse-glow inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-100"
            >
              Try NOw
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </motion.div>
    </header>
  );
}
