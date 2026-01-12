import { NextRequest, NextResponse } from 'next/server';
import { publicAuthApi } from '@/lib/api-client/client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${APP_URL}/sign-in?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${APP_URL}/sign-in?error=${encodeURIComponent('No authorization code received')}`
    );
  }

  try {
    const response = await publicAuthApi.authGoogleGet({ code });

    const data = response.data;
    if (!data) {
      return NextResponse.redirect(
        `${APP_URL}/sign-in?error=${encodeURIComponent('Invalid response from server')}`
      );
    }

    const sessionData = {
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
      },
    };

    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString(
      'base64'
    );

    return NextResponse.redirect(
      `${APP_URL}/auth/google/complete?session=${encodedSession}`
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${APP_URL}/sign-in?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}
