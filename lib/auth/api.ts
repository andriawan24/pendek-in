import { authConfig } from './config';
import { sessionManager } from './session';
import type {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
  RefreshRequestBody,
  RefreshResponse,
  MeResponse,
  BaseResponse,
  AuthSession,
} from './types';

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

async function apiRequest<T>(
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

async function authenticatedRequest<T>(
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

export async function login<T extends LoginRequestBody = LoginRequestBody>(
  body: T
): Promise<AuthSession> {
  const response = await apiRequest<BaseResponse<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const authSession = {
    tokens: {
      accessToken: response.data.token,
      accessTokenExpiredAt: Date.parse(response.data.token_expired_at),
      refreshToken: response.data.refresh_token,
      refreshTokenExpiredAt: Date.parse(response.data.refresh_token_expired_at),
    },
    user: response.data.user,
  };

  sessionManager.saveSession(authSession);

  return authSession;
}

export async function register<
  T extends RegisterRequestBody = RegisterRequestBody,
>(body: T): Promise<AuthSession> {
  const response = await apiRequest<BaseResponse<AuthResponse>>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

  const authSession = {
    user: response.data.user,
    tokens: {
      accessToken: response.data.token,
      accessTokenExpiredAt: Date.parse(response.data.token_expired_at),
      refreshToken: response.data.refresh_token,
      refreshTokenExpiredAt: Date.parse(response.data.refresh_token_expired_at),
    },
  };
  sessionManager.saveSession(authSession);

  return authSession;
}

export async function refreshToken(): Promise<RefreshResponse> {
  const refreshTokenValue = sessionManager.getRefreshToken();

  if (!refreshTokenValue) {
    throw new AuthApiError('No refresh token available', 401);
  }

  const requestBody: RefreshRequestBody = {
    refresh_token: refreshTokenValue,
  };

  const response = await apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  sessionManager.updateTokens(response.tokens);

  return response;
}

export async function getMe(): Promise<MeResponse> {
  return authenticatedRequest<MeResponse>('/auth/me', {
    method: 'GET',
  });
}

export async function withTokenRefresh<T>(
  requestFn: () => Promise<T>
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (error instanceof AuthApiError && error.statusCode === 401) {
      try {
        await refreshToken();
        return await requestFn();
      } catch (refreshError) {
        sessionManager.clearSession();
        throw refreshError;
      }
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  // If backend supports token invalidation, call it here
  // await apiRequest('/auth/logout', { method: 'POST' });

  // Clear local session
  sessionManager.clearSession();
}
