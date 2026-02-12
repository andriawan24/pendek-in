import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAccessToken,
  getRefreshToken,
  createPublicConfig,
  createAuthenticatedConfig,
} from './client';

describe('client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset localStorage
    localStorage.clear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getAccessToken', () => {
    it('returns null when no session in localStorage', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('returns access token from stored session', () => {
      const session = {
        tokens: { accessToken: 'my-token', refreshToken: 'ref' },
        user: { id: '1', email: 'test@test.com' },
      };
      localStorage.setItem('pendekIn.auth.session', JSON.stringify(session));
      expect(getAccessToken()).toBe('my-token');
    });

    it('returns null for invalid JSON in localStorage', () => {
      localStorage.setItem('pendekIn.auth.session', 'not-json');
      expect(getAccessToken()).toBeNull();
    });

    it('returns null when tokens field is missing', () => {
      const session = { user: { id: '1', email: 'test@test.com' } };
      localStorage.setItem('pendekIn.auth.session', JSON.stringify(session));
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('returns null when no session in localStorage', () => {
      expect(getRefreshToken()).toBeNull();
    });

    it('returns refresh token from stored session', () => {
      const session = {
        tokens: { accessToken: 'acc', refreshToken: 'my-refresh' },
        user: { id: '1', email: 'test@test.com' },
      };
      localStorage.setItem('pendekIn.auth.session', JSON.stringify(session));
      expect(getRefreshToken()).toBe('my-refresh');
    });

    it('returns null for invalid JSON', () => {
      localStorage.setItem('pendekIn.auth.session', '{broken');
      expect(getRefreshToken()).toBeNull();
    });
  });

  describe('createPublicConfig', () => {
    it('creates a config with default base path', () => {
      const config = createPublicConfig();
      expect(config.basePath).toBe('http://localhost:8080');
    });

    it('uses NEXT_PUBLIC_API_URL environment variable', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      const config = createPublicConfig();
      expect(config.basePath).toBe('https://api.example.com');
    });
  });

  describe('createAuthenticatedConfig', () => {
    it('creates a config with default base path', () => {
      const config = createAuthenticatedConfig();
      expect(config.basePath).toBe('http://localhost:8080');
    });
  });
});
