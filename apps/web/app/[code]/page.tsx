import { redirect, notFound } from 'next/navigation';
import { isReservedRoute } from '@/lib/config';

interface RedirectPageProps {
  params: Promise<{
    code: string;
  }>;
}

async function getRedirectUrl(code: string): Promise<string | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  try {
    const response = await fetch(`${apiBaseUrl}/${code}`, {
      redirect: 'manual',
      headers: {
        Accept: 'application/json',
      },
    });

    // Handle redirect response (302)
    if (response.status === 301 || response.status === 302) {
      const location = response.headers.get('Location');
      return location;
    }

    // Handle not found (404)
    if (response.status === 404) {
      return null;
    }

    // Handle other errors
    return null;
  } catch {
    return null;
  }
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { code } = await params;

  // Skip redirect for reserved routes
  if (isReservedRoute(code)) {
    notFound();
  }

  const redirectUrl = await getRedirectUrl(code);

  if (!redirectUrl) {
    notFound();
  }

  redirect(redirectUrl);
}
