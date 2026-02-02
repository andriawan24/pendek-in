'use client';

import { Check, Copy, Link2, Scissors } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';

export function URLShortenerDemo(): React.ReactNode {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsProcessing(true);
    // Simulate shortening
    await new Promise((resolve) => setTimeout(resolve, 800));

    const randomSlug = Math.random().toString(36).substring(2, 8);
    setShortenedUrl(`pendek.in/${randomSlug}`);
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${shortenedUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleShorten} className="relative">
        <div className="shadow-neo-lg flex items-center gap-2 rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-2">
          <div className="text-electric-yellow flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800">
            <Link2 className="h-5 w-5" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="focus-ring min-w-0 flex-1 rounded-lg bg-transparent px-2 py-3 text-sm text-white placeholder-zinc-500 outline-none"
          />
          <button
            type="submit"
            disabled={isProcessing || !url}
            className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover flex h-12 shrink-0 items-center gap-2 rounded-xl border-2 border-zinc-700 px-5 text-sm font-bold tracking-wide uppercase transition-all duration-100 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="animate-pulse">...</span>
            ) : (
              <>
                <Scissors className="h-4 w-4" />
                <span className="hidden sm:inline">Shorten</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result */}
      {shortenedUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex items-center gap-3 rounded-xl border-2 border-zinc-700 bg-zinc-800/50 p-4">
            <div className="flex-1 overflow-hidden">
              <p className="text-xs tracking-wider text-zinc-500 uppercase">
                Your shortened link
              </p>
              <p className="text-electric-yellow mt-1 truncate text-lg font-bold">
                {shortenedUrl}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-zinc-600 bg-zinc-700 transition-colors hover:bg-zinc-600"
            >
              {copied ? (
                <Check className="text-electric-yellow h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-300" />
              )}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Sign up to save your links and access analytics
          </p>
        </motion.div>
      )}
    </div>
  );
}
