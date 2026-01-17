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
        hostname: 'api.fawwaz-api.online',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
