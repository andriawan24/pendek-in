'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalLinksLine } from '@/components/legal/legal-links';

function SignInPageInner() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      router.replace('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to sign in. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }

  return (
    <div className="w-full">
      <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to manage your links and view analytics.
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="border-salmon/60 text-salmon rounded-xl border-2 bg-zinc-800 p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Continue with email
            </Button>
          </form>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-zinc-700" />
            <span className="text-xs font-bold tracking-wide text-zinc-500 uppercase">
              Or
            </span>
            <div className="h-px flex-1 bg-zinc-700" />
          </div>

          <GoogleSignInButton />

          <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
            <p className="text-sm text-zinc-300">
              Sign in with your email and password. Google OAuth will be wired
              up later.
            </p>
          </div>

          <LegalLinksLine />
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
            <p className="text-sm text-zinc-400">Loading…</p>
          </div>
        </div>
      }
    >
      <SignInPageInner />
    </Suspense>
  );
}
