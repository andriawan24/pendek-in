'use client';

import { useState } from 'react';

type LinkResultCardProps = {
  originalUrl: string;
  shortUrl: string;
};

const LinkResultCard = ({ originalUrl, shortUrl }: LinkResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Your Shortened Link</h3>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Original URL:</p>
          <p className="text-sm truncate dark:text-gray-200">{originalUrl}</p>
        </div>

        <div className="flex flex-col space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Short URL:</p>
          <div className="flex items-center">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mr-2 font-medium dark:text-blue-400"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="ml-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm py-1 px-3 rounded transition-colors duration-200"
              aria-label="Copy to clipboard"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
          <button
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="View statistics"
          >
            View Stats
          </button>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Share link"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkResultCard;
