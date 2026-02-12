import { describe, it, expect, beforeEach } from 'vitest';
import { SessionManager } from './session';
import type { AuthSession, AuthTokens, AuthUser } from './types';

function createMockStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) delete store[key];
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

const mockUser: AuthUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  is_verified: true,
  profile_image_url: 'https://example.com/avatar.png',
};

const mockTokens: AuthTokens = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  accessTokenExpiredAt: Date.now() + 3600000, // 1 hour in future
  refreshTokenExpiredAt: Date.now() + 86400000, // 1 day in future
};

const mockSession: AuthSession = {
  user: mockUser,
  tokens: mockTokens,
};

describe('SessionManager', () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager(createMockStorage());
  });

  describe('saveSession / getSession', () => {
    it('saves and retrieves a session', () => {
      manager.saveSession(mockSession);
      const session = manager.getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when no session exists', () => {
      expect(manager.getSession()).toBeNull();
    });
  });

  describe('getTokens', () => {
    it('returns tokens from saved session', () => {
      manager.saveSession(mockSession);
      expect(manager.getTokens()).toEqual(mockTokens);
    });

    it('returns null when no session exists', () => {
      expect(manager.getTokens()).toBeNull();
    });
  });

  describe('getAccessToken', () => {
    it('returns access token from saved session', () => {
      manager.saveSession(mockSession);
      expect(manager.getAccessToken()).toBe('access-token-123');
    });

    it('returns null when no session exists', () => {
      expect(manager.getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('returns refresh token from saved session', () => {
      manager.saveSession(mockSession);
      expect(manager.getRefreshToken()).toBe('refresh-token-456');
    });

    it('returns null when no session exists', () => {
      expect(manager.getRefreshToken()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('returns user from saved session', () => {
      manager.saveSession(mockSession);
      expect(manager.getUser()).toEqual(mockUser);
    });

    it('returns null when no session exists', () => {
      expect(manager.getUser()).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('returns false when token is not expired', () => {
      manager.saveSession(mockSession);
      expect(manager.isTokenExpired()).toBe(false);
    });

    it('returns true when token is expired', () => {
      const expiredSession: AuthSession = {
        ...mockSession,
        tokens: {
          ...mockTokens,
          accessTokenExpiredAt: Date.now() - 1000, // in the past
        },
      };
      manager.saveSession(expiredSession);
      expect(manager.isTokenExpired()).toBe(true);
    });

    it('returns false when no expiration is set', () => {
      const noExpSession: AuthSession = {
        ...mockSession,
        tokens: {
          ...mockTokens,
          accessTokenExpiredAt: undefined,
        },
      };
      manager.saveSession(noExpSession);
      expect(manager.isTokenExpired()).toBe(false);
    });

    it('returns false when no session exists', () => {
      expect(manager.isTokenExpired()).toBe(false);
    });
  });

  describe('clearSession', () => {
    it('removes the session', () => {
      manager.saveSession(mockSession);
      expect(manager.getSession()).not.toBeNull();
      manager.clearSession();
      expect(manager.getSession()).toBeNull();
    });
  });

  describe('updateTokens', () => {
    it('updates tokens in existing session', () => {
      manager.saveSession(mockSession);
      const newTokens: AuthTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        accessTokenExpiredAt: Date.now() + 7200000,
        refreshTokenExpiredAt: Date.now() + 172800000,
      };
      manager.updateTokens(newTokens);
      expect(manager.getTokens()).toEqual(newTokens);
      // User should be preserved
      expect(manager.getUser()).toEqual(mockUser);
    });

    it('throws when no session exists', () => {
      const newTokens: AuthTokens = {
        accessToken: 'token',
        refreshToken: 'refresh',
      };
      expect(() => manager.updateTokens(newTokens)).toThrow(
        'No session found to update'
      );
    });
  });

  describe('updateUser', () => {
    it('updates user in existing session', () => {
      manager.saveSession(mockSession);
      const newUser: AuthUser = {
        id: 'user-1',
        email: 'updated@example.com',
        name: 'Updated User',
      };
      manager.updateUser(newUser);
      expect(manager.getUser()).toEqual(newUser);
      // Tokens should be preserved
      expect(manager.getTokens()).toEqual(mockTokens);
    });

    it('throws when no session exists', () => {
      const newUser: AuthUser = {
        id: 'user-1',
        email: 'updated@example.com',
      };
      expect(() => manager.updateUser(newUser)).toThrow(
        'No session found to update'
      );
    });
  });

  describe('isAuthenticated', () => {
    it('returns true for valid, non-expired session', () => {
      manager.saveSession(mockSession);
      expect(manager.isAuthenticated()).toBe(true);
    });

    it('returns false when no session exists', () => {
      expect(manager.isAuthenticated()).toBe(false);
    });

    it('returns false when token is expired', () => {
      const expiredSession: AuthSession = {
        ...mockSession,
        tokens: {
          ...mockTokens,
          accessTokenExpiredAt: Date.now() - 1000,
        },
      };
      manager.saveSession(expiredSession);
      expect(manager.isAuthenticated()).toBe(false);
    });

    it('returns false when access token is empty', () => {
      const noTokenSession: AuthSession = {
        ...mockSession,
        tokens: {
          ...mockTokens,
          accessToken: '',
        },
      };
      manager.saveSession(noTokenSession);
      expect(manager.isAuthenticated()).toBe(false);
    });
  });
});
