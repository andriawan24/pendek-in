'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { NewLinkDrawer } from '@/components/links/new-link-drawer';
import { NewLinkProvider, useNewLink } from '@/lib/links/new-link-context';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOpen, openNewLinkDrawer, closeNewLinkDrawer, notifyLinkCreated } =
    useNewLink();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Called ' + isAuthenticated);
    if (!isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);

  const handleNewLinkSuccess = () => {
    router.refresh();
    notifyLinkCreated();
  };

  return (
    <div className="bg-charcoal min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewLink={() => {
          setSidebarOpen(false);
          openNewLinkDrawer();
        }}
      />

      <div className="lg:pl-64">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle="Dashboard"
        />

        <main className="p-4 lg:p-6">{children}</main>
      </div>

      <NewLinkDrawer
        isOpen={isOpen}
        onClose={closeNewLinkDrawer}
        onSuccess={handleNewLinkSuccess}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NewLinkProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </NewLinkProvider>
  );
}
