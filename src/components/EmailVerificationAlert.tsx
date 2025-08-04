'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { resendVerificationEmail } from '@/app/(auth)/verify-email/actions';
import { useAuth } from './AuthProvider';

export default function EmailVerificationAlert() {
  const { user, isEmailVerified } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Don't show if user is not logged in, email is verified, or alert is dismissed
  if (!user || isEmailVerified || !isVisible) {
    return null;
  }

  const handleResendEmail = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const result = await resendVerificationEmail(user.email);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Please verify your email address
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              To access all features and secure your account, please verify your email address.{' '}
              <strong>{user.email}</strong>
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-sm bg-yellow-100 dark:bg-yellow-800 px-3 py-1 rounded text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
            <Link
              href="/verify-email"
              className="text-sm text-yellow-700 dark:text-yellow-300 underline hover:text-yellow-600 dark:hover:text-yellow-200"
            >
              Learn more
            </Link>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
