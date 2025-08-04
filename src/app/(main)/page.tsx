'use client';

import LinkShortenerForm from '@/components/LinkShortenerForm';
import { useState } from 'react';
import LinkResultCard from '@/components/LinkResultCard';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export type LinkType = {
  id?: string;
  created_at?: string;
  slug: string;
  url: string;
  visits: number;
};

export default function Home() {
  const [createdLinks, setCreatedLinks] = useState<LinkType | null>(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Pendek.in</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your personal URL shortener. Create short, memorable links for easy sharing.
        </p>
        {user && (
          <p className="mt-4 text-lg text-green-600 dark:text-green-400">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </p>
        )}
      </section>

      {user ? (
        <>
          <LinkShortenerForm onSuccess={(link: LinkType) => setCreatedLinks(link)} />

          {createdLinks && (
            <LinkResultCard
              originalUrl={createdLinks.url}
              shortUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${createdLinks.slug}`}
            />
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Get Started with Pendek.in</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign up or log in to start creating your own short links and track their performance.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Shorten URLs</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create short, memorable links from long URLs
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Track Performance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor clicks and engagement on your links
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Manage Links</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize and manage all your shortened links
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
