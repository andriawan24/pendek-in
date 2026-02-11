'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow authenticated users on verify-email page
    if (isAuthenticated && !pathname.startsWith('/verify-email')) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, pathname]);

  return (
    <div className="bg-charcoal relative min-h-dvh w-full overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-electric-yellow/10 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-salmon/10 absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-xl items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
