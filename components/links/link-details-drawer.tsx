'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  Tablet,
  Loader2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Link } from '@/lib/links/types';
import { buildShortLink } from '@/lib/config';
import { getLinksApi } from '@/lib/api-client/client';

interface LinkDetailsDrawerProps {
  link: Link | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (linkId: string) => void;
}

function getDeviceIcon(type: string) {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('mobile') || lowerType.includes('phone')) {
    return <Smartphone className="text-periwinkle h-4 w-4" />;
  }
  if (lowerType.includes('tablet')) {
    return <Tablet className="text-salmon h-4 w-4" />;
  }
  return <Monitor className="text-electric-yellow h-4 w-4" />;
}

function getDeviceColor(type: string) {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('mobile') || lowerType.includes('phone')) {
    return 'bg-periwinkle';
  }
  if (lowerType.includes('tablet')) {
    return 'bg-salmon';
  }
  return 'bg-electric-yellow';
}

const getShortCode = (link: Link) => link.custom_short_code ?? link.short_code;

export function LinkDetailsDrawer({
  link,
  isOpen,
  onClose,
  onDelete,
}: LinkDetailsDrawerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkDetails, setLinkDetails] = useState<Link | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchLinkDetails = useCallback(async (linkId: string) => {
    setIsLoading(true);
    try {
      const linksApi = getLinksApi();
      const response = await linksApi.linksIdGet({ id: linkId });
      const data = response.data;

      if (data) {
        setLinkDetails({
          id: data.id ?? '',
          original_url: data.originalUrl ?? '',
          short_code: data.shortCode ?? '',
          custom_short_code: data.customShortCode,
          expired_at: data.expiredAt,
          click_count: data.clickCount,
          created_at: data.createdAt ?? '',
          device_breakdowns: data.deviceBreakdowns?.map((d) => ({
            type: d.type ?? '',
            value: d.value ?? 0,
          })),
          top_countries: data.topCountries?.map((c) => ({
            type: c.type ?? '',
            value: c.value ?? 0,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to fetch link details:', error);
      toast.error('Failed to load link details');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && link?.id) {
      fetchLinkDetails(link.id);
    } else {
      setLinkDetails(null);
    }
  }, [isOpen, link?.id, fetchLinkDetails]);

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
    const currentLink = linkDetails || link;
    if (currentLink && canvasRef.current) {
      const fullUrl = buildShortLink(getShortCode(currentLink));
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

      QRCode.toDataURL(fullUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#E4FF1A',
          light: '#121212',
        },
      }).then(setQrCodeUrl);
    }
  }, [linkDetails, link]);

  const handleCopy = async () => {
    const currentLink = linkDetails || link;
    if (!currentLink) return;
    await navigator.clipboard.writeText(
      buildShortLink(getShortCode(currentLink))
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadQR = () => {
    const currentLink = linkDetails || link;
    if (!qrCodeUrl || !currentLink) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `qr-${getShortCode(currentLink)}.png`;
    a.click();
    toast.success('QR code downloaded!');
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    const currentLink = linkDetails || link;
    if (!currentLink?.id) return;

    setIsDeleting(true);
    try {
      const linksApi = getLinksApi();
      await linksApi.linksIdDelete({ id: currentLink.id });
      toast.success('Link deleted successfully!');
      setShowDeleteConfirm(false);
      onClose();
      onDelete?.(currentLink.id);
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast.error('Failed to delete link');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!link) return null;

  const currentLink = linkDetails || link;
  const fullUrl = buildShortLink(getShortCode(currentLink));

  const deviceTotal =
    currentLink.device_breakdowns?.reduce((sum, d) => sum + d.value, 0) || 0;
  const countryTotal =
    currentLink.top_countries?.reduce((sum, c) => sum + c.value, 0) || 0;

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
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  </div>
                ) : (
                  <>
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
                        {currentLink.original_url}
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
                            <span className="text-xs uppercase">
                              Total Clicks
                            </span>
                          </div>
                          <p className="mt-1 text-2xl font-bold text-white">
                            {currentLink.click_count?.toLocaleString() ?? 0}
                          </p>
                        </div>
                        <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar className="h-4 w-4" />
                            <span className="text-xs uppercase">Created</span>
                          </div>
                          {currentLink.created_at && (
                            <>
                              <p className="mt-1 text-sm font-bold text-white">
                                {format(
                                  new Date(currentLink.created_at),
                                  'MMM d, yyyy'
                                )}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {formatDistanceToNow(
                                  new Date(currentLink.created_at),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Device breakdown */}
                    <div className="mb-6">
                      <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                        Devices
                      </label>
                      {currentLink.device_breakdowns &&
                      currentLink.device_breakdowns.length > 0 ? (
                        <div className="space-y-3">
                          {currentLink.device_breakdowns.map((device) => {
                            const percentage =
                              deviceTotal > 0
                                ? Math.round((device.value / deviceTotal) * 100)
                                : 0;
                            return (
                              <div key={device.type}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                                    {getDeviceIcon(device.type)}
                                    <span className="capitalize">
                                      {device.type}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-medium text-white">
                                      {device.value.toLocaleString()}
                                    </span>
                                    <span className="ml-2 text-xs text-zinc-500">
                                      ({percentage}%)
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-800">
                                  <div
                                    className={cn(
                                      'h-full rounded-full',
                                      getDeviceColor(device.type)
                                    )}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          No device data available yet
                        </p>
                      )}
                    </div>

                    {/* Top countries */}
                    <div className="mb-6">
                      <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-400 uppercase">
                        Top Countries
                      </label>
                      {currentLink.top_countries &&
                      currentLink.top_countries.length > 0 ? (
                        <div className="space-y-2">
                          {currentLink.top_countries.map((country) => {
                            const percentage =
                              countryTotal > 0
                                ? Math.round(
                                    (country.value / countryTotal) * 100
                                  )
                                : 0;
                            return (
                              <div
                                key={country.type}
                                className="flex items-center justify-between rounded-lg bg-zinc-800 px-3 py-2"
                              >
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-zinc-400" />
                                  <span className="text-sm text-zinc-300">
                                    {country.type}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-medium text-white">
                                    {country.value.toLocaleString()}
                                  </span>
                                  <span className="ml-2 text-xs text-zinc-500">
                                    ({percentage}%)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          No country data available yet
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer actions */}
              <div className="border-t-2 border-zinc-700 p-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleDeleteClick}
                  className="text-salmon hover:bg-salmon/10 w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Link
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
            title="Delete Link"
            description="Are you sure you want to delete this link? This action cannot be undone."
            size="md"
          >
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                <p className="text-electric-yellow truncate font-mono text-sm">
                  {fullUrl}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-400">
                  {currentLink.original_url}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}
