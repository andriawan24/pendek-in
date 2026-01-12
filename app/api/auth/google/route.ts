import { NextResponse } from 'next/server';
import { publicAuthApi } from '@/lib/api-client/client';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const response = await publicAuthApi.authGoogleGetRaw({});

    if (response.raw.redirected) {
      return NextResponse.redirect(response.raw.url);
    }

    const data = await response.value();
    if (data.message && data.message.startsWith('http')) {
      return NextResponse.redirect(data.message);
    }

    return NextResponse.redirect(
      data.data?.authUrl ??
        `${APP_URL}/sign-in?error=${encodeURIComponent('Failed to initiate Google sign in')}`
    );
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.redirect(
      `${APP_URL}/sign-in?error=${encodeURIComponent('Failed to initiate Google sign in')}`
    );
  }
}
