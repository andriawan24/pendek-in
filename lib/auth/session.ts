import type { AuthSession, AuthTokens, AuthUser } from './types';
import { authConfig } from './config';

interface SessionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class SessionManager {
  private storage: SessionStorage;

  constructor(
    storage: SessionStorage = typeof window !== 'undefined'
      ? localStorage
      : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
  ) {
    this.storage = storage;
  }

  saveSession(session: AuthSession): void {
    try {
      const sessionData = JSON.stringify(session);
      this.storage.setItem(authConfig.storage.sessionKey, sessionData);
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Failed to save session');
    }
  }

  getSession(): AuthSession | null {
    try {
      const sessionData = this.storage.getItem(authConfig.storage.sessionKey);
      if (!sessionData) return null;
      const session = JSON.parse(sessionData) as AuthSession;
      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  getTokens(): AuthTokens | null {
    const session = this.getSession();
    return session?.tokens ?? null;
  }

  getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken ?? null;
  }

  getUser(): AuthUser | null {
    const session = this.getSession();
    return session?.user ?? null;
  }

  isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens?.accessTokenExpiredAt) return false;
    return Date.now() >= tokens.accessTokenExpiredAt;
  }

  clearSession(): void {
    try {
      this.storage.removeItem(authConfig.storage.sessionKey);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  updateTokens(tokens: AuthTokens): void {
    const session = this.getSession();
    if (!session) {
      throw new Error('No session found to update');
    }

    this.saveSession({
      ...session,
      tokens,
    });
  }

  updateUser(user: AuthUser): void {
    const session = this.getSession();
    if (!session) {
      throw new Error('No session found to update');
    }

    this.saveSession({
      ...session,
      user,
    });
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session?.tokens?.accessToken) return false;

    if (this.isTokenExpired()) {
      return false;
    }

    return true;
  }
}

export const sessionManager = new SessionManager();
export { SessionManager };
