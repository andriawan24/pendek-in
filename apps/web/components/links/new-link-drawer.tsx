'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthApiError, capitalizeTitle, cn } from '@/lib/utils';
import { createLink } from '@/lib/links/api';
import { Link } from '@/lib/links/types';
import { getShortLinkBaseUrl, isReservedRoute } from '@/lib/config';

interface NewLinkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (link: Link) => void;
}

export function NewLinkDrawer({
  isOpen,
  onClose,
  onSuccess,
}: NewLinkDrawerProps) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const html = document.documentElement;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setCustomCode('');
      setExpiresAt('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    if (customCode && !/^[a-zA-Z0-9-_]+$/.test(customCode)) {
      setError(
        'Custom code can only contain letters, numbers, hyphens, and underscores'
      );
      return;
    }

    if (customCode && customCode.length < 3) {
      setError('Custom code must be at least 3 characters');
      return;
    }

    if (customCode && isReservedRoute(customCode)) {
      setError(
        'This custom code is reserved and cannot be used. Please choose a different one.'
      );
      return;
    }

    setIsLoading(true);

    try {
      let expiredDate = undefined;
      if (expiresAt) {
        expiredDate = new Date(expiresAt).toISOString();
      }

      const response = await createLink({
        original_url: url.startsWith('http') ? url : `https://${url}`,
        custom_short_code: customCode || undefined,
        expired_at: expiredDate,
      });

      toast.success('Link created successfully!');
      onSuccess?.(response);
      onClose();
    } catch (err) {
      console.error(err);
      if (err instanceof AuthApiError) {
        setError(`Failed to create link: ${capitalizeTitle(err.message)}`);
      } else {
        setError(`Failed to create link.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-pointer bg-black/60"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed z-50 border-l-2 border-zinc-700 bg-zinc-900',
              'top-0 right-0 h-full w-full max-w-md',
              'lg:w-[400px]'
            )}
          >
            <div className="flex h-full flex-col overflow-y-scroll">
              <div className="flex items-center justify-between border-b-2 border-zinc-700 p-4">
                <h2 className="text-lg font-bold tracking-wide text-white uppercase">
                  New Link
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
                <div className="flex-1 space-y-6 overflow-y-auto p-4">
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                      Destination URL <span className="text-salmon">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
                        <Link2 className="h-4 w-4" />
                      </div>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/your-long-url"
                        className="pl-11"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500">
                      The URL you want to shorten
                    </p>
                  </div>

                  {/* Custom Short Code */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                      Custom Short Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-sm text-zinc-500">
                          /
                        </div>
                        <Input
                          value={customCode}
                          onChange={(e) =>
                            setCustomCode(e.target.value.toLowerCase())
                          }
                          placeholder="my-custom-link"
                          className="pl-8 font-mono"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500">
                      Leave empty for a random code, or create your own
                    </p>
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                      Expiration Date
                    </label>
                    <div className="relative">
                      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-500">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <Input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        min={today}
                        className="pl-11"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-500">
                      Optional: Set when this link should expire
                    </p>
                  </div>

                  {/* Preview */}
                  {(url || customCode) && (
                    <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                      <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                        Preview
                      </label>
                      <p className="text-electric-yellow font-mono text-sm break-all">
                        {getShortLinkBaseUrl()}/{customCode || 'xxxxxx'}
                      </p>
                      <p className="mt-1 text-xs break-all text-zinc-500">
                        {url || 'https://...'}
                      </p>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="border-salmon/60 text-salmon rounded-xl border-2 bg-zinc-800 p-3 text-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="space-y-3 border-t-2 border-zinc-700 p-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    Create Link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={onClose}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
