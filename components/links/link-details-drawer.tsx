'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  Trash2,
  MousePointerClick,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/links/types';
import { buildShortLink } from '@/lib/config';

interface LinkDetailsDrawerProps {
  link: Link | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock analytics data
const mockAnalytics = {
  topCountries: [
    { country: 'United States', clicks: 45, percentage: 32 },
    { country: 'United Kingdom', clicks: 28, percentage: 20 },
    { country: 'Germany', clicks: 21, percentage: 15 },
    { country: 'Other', clicks: 48, percentage: 33 },
  ],
  devices: {
    mobile: 62,
    desktop: 35,
    tablet: 3,
  },
};

export function LinkDetailsDrawer({
  link,
  isOpen,
  onClose,
}: LinkDetailsDrawerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Generate QR code when link changes
  useEffect(() => {
    if (link && canvasRef.current) {
      const fullUrl = buildShortLink(link.short_code);
      QRCode.toCanvas(
        canvasRef.current,
        fullUrl,
        {
          width: 200,
          margin: 2,
          color: {
            dark: '#E4FF1A',
            light: '#121212',
          },
        },
        (error) => {
          if (error) console.error('QR Code error:', error);
        }
      );

      // Also generate data URL for download
      QRCode.toDataURL(fullUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#E4FF1A',
          light: '#121212',
        },
      }).then(setQrCodeUrl);
    }
  }, [link]);

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(buildShortLink(link.short_code));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl || !link) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qr-${link.short_code}.png`;
    a.click();
    toast.success('QR code downloaded!');
  };

  const handleDelete = () => {
    toast.error('Delete functionality coming soon');
    onClose();
  };

  if (!link) return null;

  const fullUrl = buildShortLink(link.short_code);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-pointer bg-black/60"
          />

          {/* Drawer - Desktop: right side, Mobile: bottom */}
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
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-zinc-700 p-4">
                <h2 className="text-lg font-bold tracking-wide text-white uppercase">
                  Link Details
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Short URL */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Short URL
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-3">
                    <span className="text-electric-yellow flex-1 truncate font-mono">
                      {fullUrl}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Original URL */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Original URL
                  </label>
                  <p className="text-sm break-all text-zinc-300">
                    {link.original_url}
                  </p>
                </div>

                {/* QR Code */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    QR Code
                  </label>
                  <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-zinc-700 bg-zinc-800 p-6">
                    <canvas ref={canvasRef} className="rounded-lg" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQR}
                    >
                      <Download className="h-4 w-4" />
                      Download PNG
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Statistics
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <MousePointerClick className="h-4 w-4" />
                        <span className="text-xs uppercase">Total Clicks</span>
                      </div>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {link.click_count?.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs uppercase">Created</span>
                      </div>
                      {/* <p className="mt-1 text-sm font-bold text-white">
                        {format(link.createdAt, 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDistanceToNow(link.createdAt, {
                          addSuffix: true,
                        })}
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* Device breakdown */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Devices
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Smartphone className="text-periwinkle h-4 w-4" />
                        Mobile
                      </div>
                      <span className="text-sm font-medium text-white">
                        {mockAnalytics.devices.mobile}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="bg-periwinkle h-full rounded-full"
                        style={{ width: `${mockAnalytics.devices.mobile}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <Monitor className="text-electric-yellow h-4 w-4" />
                        Desktop
                      </div>
                      <span className="text-sm font-medium text-white">
                        {mockAnalytics.devices.desktop}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="bg-electric-yellow h-full rounded-full"
                        style={{ width: `${mockAnalytics.devices.desktop}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Top countries */}
                <div className="mb-6">
                  <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                    Top Countries
                  </label>
                  <div className="space-y-2">
                    {mockAnalytics.topCountries.map((item) => (
                      <div
                        key={item.country}
                        className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm text-zinc-300">
                            {item.country}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-white">
                            {item.clicks}
                          </span>
                          <span className="ml-2 text-xs text-zinc-500">
                            ({item.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="border-t-2 border-zinc-700 p-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleDelete}
                  className="text-salmon hover:bg-salmon/10 w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Link
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
