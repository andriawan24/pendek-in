'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase.client';
import { toast } from 'react-toastify';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams?.get('token_hash');
        // const type = searchParams?.get('type');
        const next = searchParams?.get('next') ?? '/';

        if (token_hash) {
          const { error } = await supabase.auth.verifyOtp({
            type: 'email',
            token_hash,
          });

          if (error) {
            setStatus('error');
            setErrorMessage(error.message);
            toast.error('Failed to verify email: ' + error.message);
          } else {
            setStatus('success');
            toast.success('Email verified successfully! Welcome to Pendek.in!');
            setTimeout(() => {
              router.push(next);
            }, 2000);
          }
        } else {
          setStatus('error');
          setErrorMessage('Invalid verification link');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
        console.error('Email confirmation error:', error);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router, supabase.auth]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Verifying your email...
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please wait while we confirm your email address.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Email verified successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Welcome to Pendek.in! Your account is now verified and you can access all features.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you to the dashboard...
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Verification failed
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {errorMessage || 'Something went wrong while verifying your email.'}
            </p>
            <div className="mt-6 space-y-4">
              <Link
                href="/verify-email"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Request new verification email
              </Link>
              <div>
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Pendek.in
            </h2>
          </Link>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
