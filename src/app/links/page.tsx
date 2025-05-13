import Header from '@/components/Header';
import Footer from '@/components/Footer';

type LinkItem = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
};

export default function LinksPage() {
  // Dummy data - in a real app this would come from a database
  const links: LinkItem[] = [
    {
      id: '1',
      originalUrl: 'https://example.com/very-long-url-path-that-needs-shortening',
      shortUrl: 'https://pendek.in/abc123',
      createdAt: '2023-10-15',
      clicks: 45,
    },
    {
      id: '2',
      originalUrl: 'https://another-example.com/blog/article/how-to-create-url-shortener',
      shortUrl: 'https://pendek.in/def456',
      createdAt: '2023-10-14',
      clicks: 12,
    },
    {
      id: '3',
      originalUrl: 'https://github.com/user/repo/blob/main/very-long-filename-with-extension.ts',
      shortUrl: 'https://pendek.in/ghi789',
      createdAt: '2023-10-10',
      clicks: 78,
    },
    {
      id: '4',
      originalUrl: 'https://docs.example.com/getting-started/installation/requirements',
      shortUrl: 'https://pendek.in/docs',
      createdAt: '2023-10-05',
      clicks: 32,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">My Links</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage all your shortened URLs</p>
        </section>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total: {links.length} links
              </span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 text-sm rounded transition duration-200">
              Create New Link
            </button>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {links.map(link => (
                  <tr key={link.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={link.shortUrl}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.shortUrl.replace('https://pendek.in/', '')}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-gray-200 truncate max-w-[200px]">
                        {link.originalUrl}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {link.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {link.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          aria-label="Copy link"
                        >
                          Copy
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          aria-label="Delete link"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
