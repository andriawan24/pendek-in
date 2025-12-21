'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { RequireAuth } from '@/components/auth/require-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth>
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
    </RequireAuth>
  );
}
