'use client';

import { Suspense, useEffect, useEffectEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification, refreshUser, isAuthenticated } =
    useAuth();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<
    'idle' | 'verifying' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle');

  const handleVerifyCallback = useEffectEvent(async (token: string) => {
    setStatus('verifying');
    try {
      await verifyEmail(token);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Verification failed. The link may be expired or invalid.'
      );
    }
  });

  useEffect(() => {
    if (token) {
      handleVerifyCallback(token);
    }
  }, [token]);

  // Token verification mode
  if (token) {
    return (
      <div className="w-full">
        <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="border-t-electric-yellow mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-600" />
              <h1 className="text-xl font-bold tracking-wide text-white uppercase">
                Verifying your email
              </h1>
              <p className="text-sm text-zinc-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold tracking-wide text-white uppercase">
                Email verified
              </h1>
              <p className="text-sm text-zinc-400">
                Your email has been verified successfully. You can now access
                all features.
              </p>
              <Button
                className="mt-2 w-full"
                onClick={() => router.replace('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="border-salmon/30 bg-salmon/10 flex h-16 w-16 items-center justify-center rounded-full border-2">
                <XCircle className="text-salmon h-8 w-8" />
              </div>
              <h1 className="text-xl font-bold tracking-wide text-white uppercase">
                Verification failed
              </h1>
              <p className="text-sm text-zinc-400">{errorMessage}</p>
              <div className="mt-2 flex w-full flex-col gap-2">
                {isAuthenticated ? (
                  <Button
                    className="w-full"
                    onClick={() => router.replace('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => router.replace('/sign-in')}
                  >
                    Go to Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Check email mode (after registration)
  return (
    <div className="w-full">
      <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="border-electric-yellow/30 bg-electric-yellow/10 flex h-16 w-16 items-center justify-center rounded-full border-2">
            <Mail className="text-electric-yellow h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
            Check your email
          </h1>

          <p className="text-sm text-zinc-400">
            We sent a verification link to{' '}
            {email ? (
              <span className="font-medium text-white">{email}</span>
            ) : (
              'your email address'
            )}
            . Click the link in the email to verify your account.
          </p>

          <div className="mt-2 w-full space-y-3">
            <Button
              className="w-full"
              onClick={() => {
                refreshUser();
                router.replace('/dashboard');
              }}
            >
              Continue to Dashboard
            </Button>

            <Button
              variant="outline"
              className="w-full"
              disabled={resendStatus === 'sending' || resendStatus === 'sent'}
              onClick={async () => {
                setResendStatus('sending');
                try {
                  await resendVerification();
                  setResendStatus('sent');
                } catch {
                  setResendStatus('error');
                }
              }}
            >
              {resendStatus === 'sending' && 'Sending...'}
              {resendStatus === 'sent' && 'Verification email sent!'}
              {resendStatus === 'error' && 'Failed to send. Try again'}
              {resendStatus === 'idle' && 'Resend verification email'}
            </Button>

            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 lg:p-8">
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
              <p className="text-sm text-zinc-400">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
