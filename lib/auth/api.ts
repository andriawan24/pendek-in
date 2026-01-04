import {
  apiRequest,
  AuthApiError,
  authenticatedRequest,
  BaseResponse,
} from '../utils';
import { sessionManager } from './session';
import type {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
  RefreshRequestBody,
  RefreshResponse,
  MeResponse,
  AuthSession,
} from './types';

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
  // await apiRequest('/auth/logout', { method: 'POST' });

  // Clear local session
  sessionManager.clearSession();
}
