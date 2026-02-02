'use client';

import { Suspense, useEffect, useEffectEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sessionManager } from '@/lib/auth/session';
import { useAuth } from '@/lib/auth';
import type { AuthSession } from '@/lib/auth/types';

function GoogleAuthCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const setErrorCallback = useEffectEvent((message: string) => {
    setError(message);
  });

  const processSession = useEffectEvent((encodedSession: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const sessionData = JSON.parse(
        Buffer.from(encodedSession, 'base64').toString('utf-8')
      ) as AuthSession;

      sessionManager.saveSession(sessionData);
      refreshUser();

      setTimeout(() => {
        router.replace('/dashboard');
      }, 100);
    } catch (err) {
      console.error('Failed to process session:', err);
      setErrorCallback('Failed to complete sign in');
      setTimeout(() => router.push('/sign-in'), 2000);
    }
  });

  useEffect(() => {
    const encodedSession = searchParams.get('session');

    if (!encodedSession) {
      setErrorCallback('No session data received');
      setTimeout(() => router.push('/sign-in'), 2000);
      return;
    }

    processSession(encodedSession);
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="mt-2 text-sm text-zinc-400">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
        <p className="text-zinc-300">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function GoogleAuthCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
            <p className="text-zinc-300">Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleAuthCompleteContent />
    </Suspense>
  );
}
