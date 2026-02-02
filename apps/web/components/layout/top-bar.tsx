'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';

interface TopBarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export function TopBar({ onMenuClick, pageTitle = 'Dashboard' }: TopBarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useAuth();
  const [name, setName] = useState('');

  const setupProfile = useEffectEvent(() => {
    setName(user?.name ?? '');
  });

  useEffect(() => {
    setupProfile();
  }, [user]);

  useEffect(() => {
    if (!isProfileOpen) return;

    function onPointerDown(event: PointerEvent) {
      const el = profileDropdownRef.current;
      if (!el) return;

      const path =
        typeof event.composedPath === 'function'
          ? event.composedPath()
          : undefined;
      const clickedInside =
        (path && path.includes(el)) ||
        (event.target instanceof Node && el.contains(event.target));

      if (!clickedInside) setIsProfileOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsProfileOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isProfileOpen]);

  function handleSignOut() {
    setIsProfileOpen(false);
    logout();
    router.replace('/sign-in');
  }

  return (
    <header className="bg-charcoal sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-zinc-700 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-lg font-bold tracking-wide text-white uppercase lg:text-xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="bg-salmon absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        </button> */}

        <div ref={profileDropdownRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 transition-colors',
              isProfileOpen
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            )}
          >
            <div className="bg-periwinkle text-charcoal flex h-8 w-8 items-center justify-center rounded-full">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium sm:block">{name}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isProfileOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="shadow-neo-md absolute right-0 mt-2 w-48 rounded-xl border-2 border-zinc-700 bg-zinc-900 py-1"
              >
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-1 border-zinc-700" />
                <button
                  onClick={handleSignOut}
                  className="text-salmon flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
