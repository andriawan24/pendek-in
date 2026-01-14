'use client';

import Link from 'next/link';
import {
  Link2,
  ExternalLink,
  MousePointerClick,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentLink {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
}

interface RecentActivityListProps {
  links?: RecentLink[];
}

const DISPLAY_LIMIT = 3;

function truncateUrl(url: string, maxLength: number = 35): string {
  try {
    const urlObj = new URL(url);
    const displayUrl = urlObj.hostname + urlObj.pathname;
    return displayUrl.length > maxLength
      ? displayUrl.substring(0, maxLength) + '...'
      : displayUrl;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  }
}

export function RecentActivityList({ links }: RecentActivityListProps) {
  const recentLinks = links ?? [];
  const displayLinks = recentLinks.slice(0, DISPLAY_LIMIT);

  if (recentLinks.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Link2 className="mb-3 h-10 w-10 text-zinc-600" />
        <p className="text-sm text-zinc-400">No links created yet</p>
        <p className="text-xs text-zinc-500">
          Create your first shortened link above
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-2">
        {displayLinks.map((link) => (
          <li key={link.id}>
            <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-zinc-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                <Link2 className="text-periwinkle h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-electric-yellow font-mono text-sm font-medium">
                    /{link.shortCode}
                  </span>
                  <ExternalLink className="h-3 w-3 text-zinc-500" />
                </div>
                <p className="truncate text-xs text-zinc-400">
                  {truncateUrl(link.originalUrl)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="flex items-center gap-1 text-sm text-white">
                  <MousePointerClick className="h-3 w-3 text-zinc-400" />
                  {link.clicks}
                </div>
                <p className="text-xs text-zinc-500">
                  {formatDistanceToNow(new Date(link.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* View All Link */}
      <Link
        href="/dashboard/links"
        className="hover:border-electric-yellow hover:text-electric-yellow mt-4 mb-6 flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-700 py-2 text-sm font-medium text-zinc-400 transition-colors"
      >
        View All Links
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
