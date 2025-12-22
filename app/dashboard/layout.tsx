'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Called ' + isAuthenticated);
    if (!isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="bg-charcoal min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
