/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Don't fail the build on ESLint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Don't fail the build on TypeScript errors
  typescript: {
    ignoreBuildErrors: false,
  },

  // Transpile shared workspace package
  transpilePackages: ['shared'],

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.nexoragrid.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features (single block — no duplicates)
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
    ];
  },

  webpack(config) {
    return config;
  },

  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
  },

  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

module.exports = nextConfig;
