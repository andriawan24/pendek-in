'use client';

import { LinkType } from '@/app/(main)/page';
import { useState } from 'react';
import { useAuth } from './AuthProvider';

const LinkShortenerForm = ({ onSuccess }: { onSuccess: (link: LinkType) => void }) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isEmailVerified } = useAuth();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAlias(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is verified before allowing link creation
    if (!isEmailVerified) {
      setError('Please verify your email address before creating links.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Logic to handle form submission would go here
    const handleAddUrl = async () => {
      const response = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify({
          full_url: url,
          alias: customAlias === '' ? null : customAlias,
          user_id: user?.id,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        setUrl('');
        setCustomAlias('');

        const body = await response.json();

        onSuccess({
          url: body.url,
          slug: body.slug,
          visits: body.visits,
        });
      } else {
        setError(await response.json());
      }
    };

    handleAddUrl();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Shorten Your Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1 dark:text-gray-200">
            Enter your long URL
          </label>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            type="url"
            id="url"
            name="url"
            placeholder="https://example.com/very-long-url-that-needs-shortening"
            value={url}
            required
            onChange={handleUrlChange}
          />
        </div>

        <div>
          <label htmlFor="alias" className="block text-sm font-medium mb-1 dark:text-gray-200">
            Custom Alias (Optional)
          </label>
          <div className="flex items-center">
            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border dark:border-gray-600 border-r-0 rounded-l-md text-gray-500 dark:text-gray-300">
              {process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', '').replace('http://', '')}/
            </span>
            <input
              type="text"
              id="alias"
              placeholder="custom-alias"
              value={customAlias}
              onChange={handleAliasChange}
              className="flex-1 px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Leave blank to generate a random short URL
          </p>
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default LinkShortenerForm;
