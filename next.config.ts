import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    async rewrites() {
        return [
            {
                source: '/i/s',
                has: [
                    {
                        type: 'query',
                        key: 't',
                        value: '(?<t>.*)'
                    }
                ],
                destination: '/auth/password/set/:t'
            },
            {
                source: '/i/r',
                has: [
                    {
                        type: 'query',
                        key: 't',
                        value: '(?<t>.*)'
                    }
                ],
                destination: '/auth/password/reset/:t'
            }
        ]
    },
}

export default nextConfig;
