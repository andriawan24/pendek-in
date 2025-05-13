import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return { title: 'Redirecting...' };
}

export default async function RedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/redirect/' + slug, {
    method: 'GET',
  });

  if (!response.ok) {
    return redirect('/');
  }

  const body = await response.json();
  return redirect(body.data.url);
}
