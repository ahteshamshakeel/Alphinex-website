/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Explicitly tell Next.js not to try to statically analyze API routes
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
