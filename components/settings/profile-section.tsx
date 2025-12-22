'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { BentoCard } from '@/components/ui/bento-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

export function ProfileSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const setupProfile = useEffectEvent(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setIsVerified(user?.is_verified === true);
  });

  useEffect(() => {
    setupProfile();
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Profile updated!');
  };

  return (
    <BentoCard title="Profile" icon={<User className="h-4 w-4" />}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <User className="h-8 w-8 text-zinc-500" />
          </div>

          <Button variant="outline" size="sm">
            Change Avatar
          </Button>
        </div>

        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-400">
            Email
          </label>
          <div className="flex items-center gap-2">
            <span className="text-white">{email}</span>
            {isVerified && (
              <span className="flex items-center gap-1 text-xs text-green-500">
                <Check className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>

        <Button onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>
    </BentoCard>
  );
}
