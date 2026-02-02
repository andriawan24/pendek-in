'use client';

import { Settings } from 'lucide-react';

export function SettingsHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-zinc-800 p-2">
        <Settings className="text-periwinkle h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
          Settings
        </h1>
        <p className="text-sm text-zinc-400">
          Manage your account and preferences
        </p>
      </div>
    </div>
  );
}
