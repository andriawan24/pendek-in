/**
 * API Client Configuration
 *
 * This file creates configured instances of the generated API clients
 * with authentication handling and base URL configuration.
 */

import {
  Configuration,
  AuthApi,
  LinksApi,
  AnalyticsApi,
  RedirectApi,
} from './index';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
  }
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
};

// Storage key for session data
const SESSION_STORAGE_KEY = 'pendekIn.auth.session';

/**
 * Get the current access token from session storage
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    return session?.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Get the current refresh token from session storage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);
    return session?.tokens?.refreshToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Create a configuration for unauthenticated requests
 */
export function createPublicConfig(): Configuration {
  return new Configuration({
    basePath: getApiBaseUrl(),
  });
}

/**
 * Create a configuration for authenticated requests
 */
export function createAuthenticatedConfig(): Configuration {
  return new Configuration({
    basePath: getApiBaseUrl(),
    apiKey: async () => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }
      return `Bearer ${token}`;
    },
  });
}

// Public API instances (for login/register and redirect)
export const publicAuthApi = new AuthApi(createPublicConfig());
export const publicRedirectApi = new RedirectApi(createPublicConfig());

// Authenticated API instances (created on-demand to get fresh token)
export function getAuthApi(): AuthApi {
  return new AuthApi(createAuthenticatedConfig());
}

export function getLinksApi(): LinksApi {
  return new LinksApi(createAuthenticatedConfig());
}

export function getAnalyticsApi(): AnalyticsApi {
  return new AnalyticsApi(createAuthenticatedConfig());
}

export function getRedirectApi(): RedirectApi {
  return new RedirectApi(createPublicConfig());
}

// Re-export types
export * from './models/index';
export * from './apis/index';
export { Configuration, ResponseError, FetchError } from './runtime';
