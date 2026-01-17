'use client';

import { Suspense, useState } from 'react';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LegalLinksLine } from '@/components/legal/legal-links';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignUpPageInner() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      setIsLoading(false);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name: trimmedName,
        email: normalizedEmail,
        password,
      });

      router.replace('/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
            Sign up
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create an account to start shortening links.
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <Input
              id="name"
              label="Name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            {error && (
              <div className="border-salmon/60 text-salmon rounded-xl border-2 bg-zinc-800 p-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
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

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-electric-yellow hover:underline"
            >
              Sign in
            </Link>
          </p>

          <LegalLinksLine />
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
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
      <SignUpPageInner />
    </Suspense>
  );
}
