/**
 * Application Configuration
 *
 * Centralized configuration for environment variables and app settings.
 */

/**
 * Get the base URL for shortened links.
 * This is the URL that will be used to redirect users when they click on a shortened link.
 *
 * @example
 * Returns "https://pendek.in" in production
 * Returns "http://localhost:8080" in development
 */
export function getShortLinkBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SHORT_LINK_BASE_URL ?? 'http://localhost:8080';
}

/**
 * Get the API base URL for backend requests.
 */
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
}

/**
 * Build a full shortened link URL from a short code.
 *
 * @param shortCode - The short code for the link
 * @returns The full URL for the shortened link
 *
 * @example
 * buildShortLink('abc123') // Returns "https://pendek.in/abc123"
 */
export function buildShortLink(shortCode: string): string {
  const baseUrl = getShortLinkBaseUrl();
  return `${baseUrl}/${shortCode}`;
}

export const config = {
  shortLinkBaseUrl: getShortLinkBaseUrl(),
  apiBaseUrl: getApiBaseUrl(),
} as const;
