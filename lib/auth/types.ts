export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiredAt?: number;
  refreshTokenExpiredAt?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  is_verified?: boolean;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  name?: string;
}

export interface RefreshRequestBody {
  refresh_token: string;
}

export interface AuthResponse {
  token: string;
  token_expired_at: string;
  refresh_token: string;
  refresh_token_expired_at: string;
  user: AuthUser;
}

export interface RefreshResponse {
  tokens: AuthTokens;
}

export interface MeResponse {
  user: AuthUser;
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
