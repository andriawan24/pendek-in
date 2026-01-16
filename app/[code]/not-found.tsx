'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Link2Off, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-charcoal flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-zinc-700 bg-zinc-900"
        >
          <Link2Off className="text-electric-yellow h-12 w-12" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 text-6xl font-bold text-white"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-electric-yellow mb-4 text-2xl font-semibold"
        >
          Link Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 max-w-md text-zinc-400"
        >
          The shortened link you&apos;re looking for doesn&apos;t exist or may
          have been removed. Please check the URL and try again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="bg-electric-yellow shadow-neo hover:shadow-neo-lg flex items-center gap-2 rounded-xl border-2 border-zinc-900 px-6 py-3 font-semibold text-zinc-900 transition-all hover:-translate-y-0.5"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="shadow-neo hover:shadow-neo-lg flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
