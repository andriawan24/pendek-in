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
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
