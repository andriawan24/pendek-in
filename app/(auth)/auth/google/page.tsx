'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { GoogleLogo } from '@/components/auth/google-logo';
import Link from 'next/link';

export default function GoogleAuthStubPage() {
  const router = useRouter();

  function continueToDashboard() {
    try {
      localStorage.setItem(
        'trimBento.auth',
        JSON.stringify({
          email: 'google.user@example.com',
          createdAt: Date.now(),
        })
      );
    } catch {
      // ignore
    }
    router.replace('/dashboard');
  }

  return (
    <div className="w-full">
      <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <GoogleLogo className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              Google sign-in
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              UI stub — OAuth redirect will be implemented later.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
          <div className="flex items-center gap-3 text-zinc-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="border-t-electric-yellow h-5 w-5 rounded-full border-2 border-zinc-500"
              aria-hidden="true"
            />
            <p className="text-sm">
              Normally we&apos;d redirect you to Google here.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={continueToDashboard}
            className="bg-electric-yellow text-charcoal shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 px-5 py-3 font-bold tracking-wide uppercase transition-all duration-100"
          >
            Continue to dashboard
          </button>
          <Link
            href="/sign-in"
            className="shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-5 py-3 font-bold tracking-wide text-white uppercase transition-all duration-100 hover:bg-zinc-800"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
