'use client';

import { useRouter } from 'next/navigation';
import ButtonLink from 'next/link';
import { useEffect, useState } from 'react';
import { LinkType } from '../page';

export default function LinksPage() {
  const [data, setData] = useState<Array<LinkType>>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links`, {
        method: 'GET',
      });

      if (!response.ok) {
        router.replace('/');
      }

      setLoading(false);

      const body = await response.json();
      setData(body);
    };

    fetchData();
  }, [router]);

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">My Links</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage all your shortened URLs</p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total: {data.length} links
            </span>
          </div>
          <ButtonLink
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 text-sm rounded transition duration-200"
          >
            Create New Link
          </ButtonLink>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Short URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Original URL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading && (
                <tr>
                  <td className="px-6 py-4 text-center" rowSpan={5}>
                    Loading...
                  </td>
                </tr>
              )}
              {data.map((link: LinkType) => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={link.slug}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.slug}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate max-w-[200px]">
                      {link.url}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Intl.DateTimeFormat('en-US', {
                      timeStyle: 'short',
                      dateStyle: 'full',
                    }).format(new Date(link.created_at ?? ''))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {link.visits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
