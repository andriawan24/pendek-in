import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { authConfig, sessionManager } from './auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${authConfig.apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorData: unknown;

    try {
      errorData = await response.json();
      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
      ) {
        errorMessage = String(errorData.message);
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new AuthApiError(errorMessage, response.status, errorData);
  }

  return response.json() as Promise<T>;
}

export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = sessionManager.getAccessToken();

  if (!accessToken) {
    throw new AuthApiError('No access token available', 401);
  }

  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
