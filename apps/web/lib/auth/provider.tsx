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
  updateProfile as apiUpdateProfile,
} from './api';
import type { AuthUser, LoginRequestBody, RegisterRequestBody } from './types';

interface UpdateProfileBody {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: Blob;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequestBody) => Promise<void>;
  register: (data: RegisterRequestBody) => Promise<void>;
  loginWithGoogle: (code: string) => Promise<void>;
  updateProfile: (data: UpdateProfileBody) => Promise<void>;
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

  const updateProfile = useCallback(async (data: UpdateProfileBody) => {
    const updatedUser = await apiUpdateProfile(data);
    setUser(updatedUser);
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
        updateProfile,
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
