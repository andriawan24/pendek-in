import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'link.andriawan.dev',
      },
      {
        protocol: 'https',
        hostname: 'link.fawwaz-api.online',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.fawwaz-api.online',
      },
    ],
  },
};

export default nextConfig;
