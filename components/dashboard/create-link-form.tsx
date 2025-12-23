'use client';

import { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createLink } from '@/lib/links/api';

export function CreateLinkForm() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await createLink({
        original_url: url,
      });

      const newShortenedUrl = `localhost:8080/${response.short_code}`;
      setShortenedUrl(newShortenedUrl);

      toast.success('Link shortened!');

      setIsLoading(false);
      setUrl('');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to generate shortened link: ' + error);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`http://${shortenedUrl}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
            <Link2 className="h-5 w-5" />
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="pl-12 text-lg"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full text-xl"
        >
          Shorten
        </Button>
      </form>

      {/* Shortened URL display */}
      {shortenedUrl && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-3">
          <span className="text-periwinkle flex-1 truncate">
            http://{shortenedUrl}
          </span>
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            {isCopied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
