'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { sessionManager } from './session';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  loginWithGoogle as apiLoginWithGoogle,
} from './api';
import type { AuthUser, LoginRequestBody, RegisterRequestBody } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequestBody) => Promise<void>;
  register: (data: RegisterRequestBody) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const session = sessionManager.getSession();
  return session && sessionManager.isAuthenticated() ? session.user : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  const login = useCallback(async (credentials: LoginRequestBody) => {
    const session = await apiLogin(credentials);
    setUser(session.user);
  }, []);

  const register = useCallback(async (data: RegisterRequestBody) => {
    const session = await apiRegister(data);
    setUser(session.user);
  }, []);

  const loginWithGoogle = useCallback(async (code: string) => {
    const session = await apiLoginWithGoogle(code);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    const session = sessionManager.getSession();
    if (session && sessionManager.isAuthenticated()) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
