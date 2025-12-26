'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  Settings,
  X,
  Scissors,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/links', label: 'My Links', icon: Link2 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewLink?: () => void;
}

export function Sidebar({ isOpen, onClose, onNewLink }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="lg:bg-charcoal-light hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r-2 lg:border-zinc-700">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b-2 border-zinc-700 px-6">
            <div className="bg-electric-yellow flex h-8 w-8 items-center justify-center rounded-lg">
              <Scissors className="text-charcoal h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              TrimBento
            </span>
          </div>

          {/* New Link Button */}
          <div className="px-3 pt-4">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={onNewLink}
            >
              <Plus className="h-4 w-4" />
              New Link
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-electric-yellow text-charcoal shadow-neo-sm'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t-2 border-zinc-700 p-4">
            <div className="rounded-xl bg-zinc-800 p-4">
              <p className="text-xs text-zinc-400">
                Free Plan - 10 links remaining
              </p>
              <Link
                href="/dashboard/upgrade"
                className="text-electric-yellow mt-2 block text-sm font-bold hover:underline"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 cursor-pointer bg-black/60 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-charcoal-light fixed inset-y-0 left-0 z-50 w-72 border-r-2 border-zinc-700 lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header with close button */}
                <div className="flex h-16 items-center justify-between border-b-2 border-zinc-700 px-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-electric-yellow flex h-8 w-8 items-center justify-center rounded-lg">
                      <Scissors className="text-charcoal h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase">
                      TrimBento
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* New Link Button */}
                <div className="px-3 pt-4">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={onNewLink}
                  >
                    <Plus className="h-4 w-4" />
                    New Link
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                          isActive
                            ? 'bg-electric-yellow text-charcoal shadow-neo-sm'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="border-t-2 border-zinc-700 p-4">
                  <div className="rounded-xl bg-zinc-800 p-4">
                    <p className="text-xs text-zinc-400">
                      Free Plan - 10 links remaining
                    </p>
                    <Link
                      href="/dashboard/upgrade"
                      className="text-electric-yellow mt-2 block text-sm font-bold hover:underline"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
