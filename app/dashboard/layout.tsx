'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const nextParam = useMemo(() => {
    // Always bring users back to the current dashboard route after signing in.
    const p = pathname?.startsWith('/dashboard') ? pathname : '/dashboard';
    return encodeURIComponent(p);
  }, [pathname]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('trimBento.auth');
      // Defer state update to avoid setState-in-effect lint.
      Promise.resolve().then(() => setIsAuthed(Boolean(raw)));
      if (!raw) {
        router.replace(`/sign-in?next=${nextParam}`);
      }
    } catch {
      Promise.resolve().then(() => setIsAuthed(false));
      router.replace(`/sign-in?next=${nextParam}`);
    }
  }, [router, nextParam]);

  if (isAuthed === false) return null;
  if (isAuthed === null) {
    return (
      <div className="bg-charcoal flex min-h-screen items-center justify-center px-4">
        <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6 text-center">
          <p className="text-sm text-zinc-400">Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-charcoal min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-64">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle="Dashboard"
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
