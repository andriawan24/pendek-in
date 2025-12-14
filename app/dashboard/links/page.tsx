'use client';

import { useState } from 'react';
import {
  Link2,
  Search,
  Copy,
  Check,
  ExternalLink,
  MoreVertical,
  MousePointerClick,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LinkDetailsDrawer } from '@/components/links/link-details-drawer';

interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

// Mock data
const mockLinks: Link[] = [
  {
    id: '1',
    shortCode: 'abc123',
    originalUrl: 'https://example.com/very-long-url-that-needs-shortening',
    clicks: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    shortCode: 'xyz789',
    originalUrl: 'https://github.com/user/repository',
    clicks: 87,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    shortCode: 'def456',
    originalUrl: 'https://docs.google.com/document/d/1234567890',
    clicks: 56,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: '4',
    shortCode: 'ghi321',
    originalUrl: 'https://medium.com/article/how-to-build-great-products',
    clicks: 34,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '5',
    shortCode: 'jkl654',
    originalUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    clicks: 21,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: '6',
    shortCode: 'mno987',
    originalUrl: 'https://twitter.com/user/status/123456789',
    clicks: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

export default function LinksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLinks = mockLinks.filter(
    (link) =>
      link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (link: Link) => {
    await navigator.clipboard.writeText(
      `https://trimbento.com/${link.shortCode}`
    );
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
            My Links
          </h1>
          <p className="text-sm text-zinc-400">
            Manage and track all your shortened links
          </p>
        </div>
        <Button variant="primary" size="md">
          <Link2 className="h-4 w-4" />
          New Link
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search links..."
          className="pl-11"
        />
      </div>

      {/* Links list */}
      <div className="overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-900">
        {/* Table header */}
        <div className="hidden border-b-2 border-zinc-700 bg-zinc-800/50 px-6 py-3 sm:grid sm:grid-cols-12 sm:gap-4">
          <div className="col-span-4 text-xs font-bold tracking-wider text-zinc-400 uppercase">
            Short Link
          </div>
          <div className="col-span-4 text-xs font-bold tracking-wider text-zinc-400 uppercase">
            Original URL
          </div>
          <div className="col-span-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">
            Clicks
          </div>
          <div className="col-span-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">
            Created
          </div>
        </div>

        {/* Links */}
        {filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Link2 className="mb-3 h-12 w-12 text-zinc-600" />
            <p className="text-zinc-400">No links found</p>
            <p className="text-sm text-zinc-500">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first shortened link'}
            </p>
          </div>
        ) : (
          <ul className="divide-y-2 divide-zinc-700">
            {filteredLinks.map((link) => (
              <li key={link.id}>
                <div
                  onClick={() => setSelectedLink(link)}
                  className="group w-full cursor-pointer px-6 py-4 text-left transition-colors hover:bg-zinc-800/50"
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-electric-yellow font-mono text-sm font-medium">
                        trimbento.com/{link.shortCode}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-zinc-400">
                        {link.clicks}
                      </div>
                    </div>
                    <p className="truncate text-xs text-zinc-400">
                      {link.originalUrl}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                    </p>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                    <div className="col-span-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-zinc-700">
                        <Link2 className="text-periwinkle h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-electric-yellow font-mono text-sm font-medium">
                          /{link.shortCode}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(link);
                        }}
                        className="rounded p-1 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-700 hover:text-white"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="col-span-4 flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm text-zinc-400">
                        {link.originalUrl}
                      </p>
                      <ExternalLink className="h-3 w-3 shrink-0 text-zinc-500" />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-1 text-sm text-white">
                        <MousePointerClick className="h-4 w-4 text-zinc-400" />
                        {link.clicks.toLocaleString()}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">
                        {formatDistanceToNow(link.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle menu
                        }}
                        className="rounded p-1 text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-700 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Link details drawer */}
      <LinkDetailsDrawer
        link={selectedLink}
        isOpen={!!selectedLink}
        onClose={() => setSelectedLink(null)}
      />
    </div>
  );
}
