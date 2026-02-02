'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6">
        <BarChart3 className="mx-auto h-16 w-16 text-zinc-600" />
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-wide text-white uppercase">
        No Analytics Yet
      </h2>
      <p className="mt-2 max-w-md text-zinc-400">
        Create your first link to start tracking clicks, devices, locations, and
        more.
      </p>
      <Link href="/dashboard" className="mt-6">
        <Button>Create Your First Link</Button>
      </Link>
    </div>
  );
}
