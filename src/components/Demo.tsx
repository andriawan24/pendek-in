'use client';

import { useState } from 'react';
import LinkShortenerForm from './LinkShortenerForm';
import LinkResultCard from './LinkResultCard';

const Demo = () => {
  const [result, setResult] = useState<{
    originalUrl: string;
    shortUrl: string;
  } | null>(null);

  // When we implement actual functionality, this would be hooked up to the LinkShortenerForm
  const handleCreateShortLink = (originalUrl: string, customAlias?: string) => {
    // This is just for demo purposes - in a real app this would call an API
    const shortUrl = customAlias
      ? `https://pendek.in/${customAlias}`
      : `https://pendek.in/${Math.random().toString(36).substring(2, 8)}`;

    setResult({
      originalUrl,
      shortUrl,
    });
  };

  return (
    <div className="py-8">
      <LinkShortenerForm />

      {/* For demo purposes, let's show a sample result */}
      {result ? (
        <LinkResultCard originalUrl={result.originalUrl} shortUrl={result.shortUrl} />
      ) : (
        <LinkResultCard
          originalUrl="https://example.com/very-long-url-that-needs-shortening"
          shortUrl="https://pendek.in/abc123"
        />
      )}
    </div>
  );
};

export default Demo;
