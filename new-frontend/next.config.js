/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: [
      'cdn.jsdelivr.net',
      'www.larvalabs.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.larvalabs.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
