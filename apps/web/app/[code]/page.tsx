import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { isReservedRoute } from '@/lib/config';

interface RedirectPageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { code } = await params;

  if (isReservedRoute(code)) {
    notFound();
  }

  const headersList = await headers();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/${code}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip: headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '',
        userAgent: headersList.get('user-agent') || '',
        referer: headersList.get('referer') || '',
      }),
    }
  );

  if (!response.ok) {
    notFound();
  }

  const { redirect_url } = await response.json();
  redirect(redirect_url);
}
