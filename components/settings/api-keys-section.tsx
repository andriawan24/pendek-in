'use client';

import { useState } from 'react';
import { BentoCard } from '@/components/ui/bento-card';
import { Button } from '@/components/ui/button';
import { Key, Copy, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
}

export function ApiKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'tb_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-03-10'),
    },
  ]);

  const generateKey = () => {
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: `API Key ${keys.length + 1}`,
      key: `tb_live_${crypto.randomUUID().replace(/-/g, '')}`,
      createdAt: new Date(),
      lastUsed: null,
    };
    setKeys([...keys, newKey]);
    toast.success('New API key generated!');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    toast.success('API key deleted');
  };

  return (
    <BentoCard title="API Keys" icon={<Key className="h-4 w-4" />}>
      {/* Mock Feature Notice */}
      <div className="mb-6 flex items-center gap-2 rounded-lg bg-zinc-800 p-3 text-sm">
        <AlertCircle className="text-electric-yellow h-4 w-4 flex-shrink-0" />
        <span className="text-zinc-400">
          API functionality coming soon. Keys generated here are for preview
          only.
        </span>
      </div>

      <div className="space-y-4">
        {keys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="flex items-center justify-between rounded-xl border-2 border-zinc-700 bg-zinc-800/50 p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{apiKey.name}</p>
              <p className="truncate font-mono text-sm text-zinc-500">
                {apiKey.key}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyKey(apiKey.key)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteKey(apiKey.id)}
                className="text-salmon hover:text-salmon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={generateKey} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>
    </BentoCard>
  );
}
