import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/i/s',
        has: [
          {
            type: 'query',
            key: 't',
            value: '(?<t>.*)',
          },
        ],
        destination: '/auth/password/set/:t',
      },
      {
        source: '/i/r',
        has: [
          {
            type: 'query',
            key: 't',
            value: '(?<t>.*)',
          },
        ],
        destination: '/auth/password/reset/:t',
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
