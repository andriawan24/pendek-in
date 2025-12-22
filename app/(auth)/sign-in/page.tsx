'use client';

import { Suspense, useState } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      router.replace('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />

            {error && (
              <div className="border-salmon/60 text-salmon rounded-xl border-2 bg-zinc-800 p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Continue with email'}
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
