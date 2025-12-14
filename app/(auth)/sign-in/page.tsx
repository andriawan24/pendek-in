'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalLinksLine } from '@/components/legal/legal-links';

function SignInPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => {
    const next = searchParams.get('next');
    return next && next.startsWith('/dashboard') ? next : '/dashboard';
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      // Simple client-side stub auth (replace with real backend later).
      localStorage.setItem(
        'trimBento.auth',
        JSON.stringify({ email: normalizedEmail, createdAt: Date.now() })
      );
      router.replace(nextPath);
    } catch {
      setError('Unable to sign in on this device.');
    } finally {
      setIsLoading(false);
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

            <Button type="submit" isLoading={isLoading} className="w-full">
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
              Email/password is a{' '}
              <span className="font-bold text-white">simple local stub</span>{' '}
              for now (stored in your browser). Google OAuth will be wired up
              later.
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
