'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LinkShortenerForm from '@/components/LinkShortenerForm';
import { useState } from 'react';
import LinkResultCard from '@/components/LinkResultCard';

export type Link = {
  id?: string;
  created_at?: string;
  slug: string;
  url: string;
  visits: number;
};

export default function Home() {
  const [createdLinks, setCreatedLinks] = useState<Link | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Pendek.in</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personal URL shortener. Create short, memorable links for easy sharing.
          </p>
        </section>

        <LinkShortenerForm onSuccess={(link: Link) => setCreatedLinks(link)} />

        {createdLinks && (
          <LinkResultCard
            originalUrl={createdLinks.url}
            shortUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${createdLinks.slug}`}
          />
        )}
        {/* <RecentLinks /> */}
      </main>

      <Footer />
    </div>
  );
}
