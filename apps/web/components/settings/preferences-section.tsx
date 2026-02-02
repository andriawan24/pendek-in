'use client';

import { useState } from 'react';
import { BentoCard } from '@/components/ui/bento-card';
import { Button } from '@/components/ui/button';
import { Settings, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function PreferencesSection() {
  const [expiration, setExpiration] = useState('never');
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Preferences saved!');
  };

  return (
    <BentoCard title="Preferences" icon={<Settings className="h-4 w-4" />}>
      <div className="space-y-6">
        {/* Default Expiration */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Default Link Expiration
          </label>
          <select
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            className="focus:border-electric-yellow w-full rounded-xl border-2 border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors focus:outline-none"
          >
            <option value="never">Never</option>
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
            <option value="1y">1 year</option>
          </select>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-zinc-800 p-2">
              <Bell className="h-5 w-5 text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-white">Email Notifications</p>
              <p className="text-sm text-zinc-500">
                Get notified when links hit milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              notifications ? 'bg-electric-yellow' : 'bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                notifications ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>

        <Button onClick={handleSave} isLoading={isSaving}>
          Save Preferences
        </Button>
      </div>
    </BentoCard>
  );
}
