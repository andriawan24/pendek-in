'use client';

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from 'react';
import { sessionManager } from './session';
import { authConfig } from './config';
import type { AuthUser, AuthSession } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const listeners = new Set<() => void>();

// Cache for snapshot to avoid infinite loop
let cachedSession: AuthSession | null = null;
let cachedSessionJson: string | null = null;

function emitChange() {
  // Invalidate cache when session changes
  cachedSessionJson = null;
  listeners.forEach((listener) => listener());
}

function subscribeToSession(callback: () => void) {
  listeners.add(callback);

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === authConfig.storage.sessionKey) {
      // Invalidate cache on storage change
      cachedSessionJson = null;
      callback();
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorageChange);
  };
}

function getSessionSnapshot(): AuthSession | null {
  const currentJson =
    typeof window !== 'undefined'
      ? localStorage.getItem(authConfig.storage.sessionKey)
      : null;

  // Return cached session if JSON hasn't changed
  if (currentJson === cachedSessionJson) {
    return cachedSession;
  }

  // Update cache
  cachedSessionJson = currentJson;
  cachedSession = sessionManager.getSession();
  return cachedSession;
}

function getServerSnapshot(): AuthSession | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSnapshot
  );

  const user = session?.user ?? null;

  const refreshAuth = useCallback(() => {
    emitChange();
  }, []);

  const signOut = useCallback(() => {
    sessionManager.clearSession();
    emitChange();
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: authConfig.storage.sessionKey,
        newValue: null,
      })
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false, // useSyncExternalStore handles hydration via getServerSnapshot
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
