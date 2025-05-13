'use client';

type LinkItem = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
};

const RecentLinks = () => {
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
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
      <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Links</h2>

      {links.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center transition-colors">
          <p className="text-gray-500 dark:text-gray-400">No links created yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentLinks;
