import { publicAuthApi, getAuthApi, ResponseError } from '../api-client/client';
import { sessionManager } from './session';
import type { AuthSession, AuthTokens } from './types';

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

/**
 * Handle API errors and convert to AuthApiError
 */
async function handleApiError(error: unknown): Promise<never> {
  if (error instanceof ResponseError) {
    let errorMessage = `Request failed with status ${error.response.status}`;
    let errorData: unknown;

    try {
      errorData = await error.response.json();
      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData
      ) {
        errorMessage = String((errorData as { message: string }).message);
      }
    } catch {
      errorMessage = error.response.statusText || errorMessage;
    }

    throw new AuthApiError(errorMessage, error.response.status, errorData);
  }

  if (error instanceof Error) {
    throw new AuthApiError(error.message);
  }

  throw new AuthApiError('Unknown error occurred');
}

/**
 * Login with email and password
 */
export async function login(body: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  try {
    const response = await publicAuthApi.authLoginPost({
      request: {
        email: body.email,
        password: body.password,
      },
    });

    const data = response.data;
    if (!data) {
      throw new AuthApiError('Invalid response from server');
    }

    const authSession: AuthSession = {
      tokens: {
        accessToken: data.token ?? '',
        accessTokenExpiredAt: data.tokenExpiredAt
          ? Date.parse(data.tokenExpiredAt)
          : undefined,
        refreshToken: data.refreshToken ?? '',
        refreshTokenExpiredAt: data.refreshTokenExpiredAt
          ? Date.parse(data.refreshTokenExpiredAt)
          : undefined,
      },
      user: {
        id: data.user?.id ?? '',
        email: data.user?.email ?? '',
        name: data.user?.name,
        is_verified: data.user?.isVerified,
        profile_image_url: data.user?.profileImageUrl,
      },
    };

    sessionManager.saveSession(authSession);
    return authSession;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Register new user
 */
export async function register(body: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthSession> {
  try {
    const response = await publicAuthApi.authRegisterPost({
      request: {
        email: body.email,
        password: body.password,
        name: body.name ?? '',
      },
    });

    const data = response.data;
    if (!data) {
      throw new AuthApiError('Invalid response from server');
    }

    const authSession: AuthSession = {
      tokens: {
        accessToken: data.token ?? '',
        accessTokenExpiredAt: data.tokenExpiredAt
          ? Date.parse(data.tokenExpiredAt)
          : undefined,
        refreshToken: data.refreshToken ?? '',
        refreshTokenExpiredAt: data.refreshTokenExpiredAt
          ? Date.parse(data.refreshTokenExpiredAt)
          : undefined,
      },
      user: {
        id: data.user?.id ?? '',
        email: data.user?.email ?? '',
        name: data.user?.name,
        is_verified: data.user?.isVerified,
        profile_image_url: data.user?.profileImageUrl,
      },
    };

    sessionManager.saveSession(authSession);
    return authSession;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(): Promise<AuthTokens> {
  const refreshTokenValue = sessionManager.getRefreshToken();

  if (!refreshTokenValue) {
    throw new AuthApiError('No refresh token available', 401);
  }

  try {
    const response = await publicAuthApi.authRefreshPost({
      request: {
        refreshToken: refreshTokenValue,
      },
    });

    const data = response.data;
    if (!data) {
      throw new AuthApiError('Invalid response from server');
    }

    const tokens: AuthTokens = {
      accessToken: data.token ?? '',
      accessTokenExpiredAt: data.tokenExpiredAt
        ? Date.parse(data.tokenExpiredAt)
        : undefined,
      refreshToken: data.refreshToken ?? '',
      refreshTokenExpiredAt: data.refreshTokenExpiredAt
        ? Date.parse(data.refreshTokenExpiredAt)
        : undefined,
    };

    sessionManager.updateTokens(tokens);
    return tokens;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get current user profile
 */
export async function getMe(): Promise<AuthSession['user']> {
  try {
    const authApi = getAuthApi();
    const response = await authApi.authMeGet();

    const user = response.data;
    if (!user) {
      throw new AuthApiError('Invalid response from server');
    }

    return {
      id: user.id ?? '',
      email: user.email ?? '',
      name: user.name,
      is_verified: user.isVerified,
      profile_image_url: user.profileImageUrl,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Wrap a request with automatic token refresh on 401
 */
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
      } catch {
        sessionManager.clearSession();
        throw error;
      }
    }
    throw error;
  }
}

/**
 * Login with Google OAuth using authorization code
 */
export async function loginWithGoogle(code: string): Promise<AuthSession> {
  try {
    const response = await publicAuthApi.authGoogleGet({ code });

    const data = response.data;
    if (!data) {
      throw new AuthApiError('Invalid response from server');
    }

    const authSession: AuthSession = {
      tokens: {
        accessToken: data.token ?? '',
        accessTokenExpiredAt: data.tokenExpiredAt
          ? Date.parse(data.tokenExpiredAt)
          : undefined,
        refreshToken: data.refreshToken ?? '',
        refreshTokenExpiredAt: data.refreshTokenExpiredAt
          ? Date.parse(data.refreshTokenExpiredAt)
          : undefined,
      },
      user: {
        id: data.user?.id ?? '',
        email: data.user?.email ?? '',
        name: data.user?.name,
        is_verified: data.user?.isVerified,
        profile_image_url: data.user?.profileImageUrl,
      },
    };

    sessionManager.saveSession(authSession);
    return authSession;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Update user profile
 */
export async function updateProfile(body: {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: Blob;
}): Promise<AuthSession['user']> {
  return withTokenRefresh(async () => {
    try {
      const authApi = getAuthApi();
      const response = await authApi.authUpdateProfilePut({
        name: body.name,
        email: body.email,
        password: body.password,
        profileImage: body.profileImage,
      });

      const user = response.data;
      if (!user) {
        throw new AuthApiError('Invalid response from server');
      }

      const updatedUser: AuthSession['user'] = {
        id: user.id ?? '',
        email: user.email ?? '',
        name: user.name,
        is_verified: user.isVerified,
        profile_image_url: user.profileImageUrl,
      };

      sessionManager.updateUser(updatedUser);
      return updatedUser;
    } catch (error) {
      return handleApiError(error);
    }
  });
}

/**
 * Logout - clear local session
 */
export async function logout(): Promise<void> {
  sessionManager.clearSession();
}
