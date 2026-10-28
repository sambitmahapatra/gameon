/**
 * Two build modes:
 *   npm run build         → server build with working API routes (website / Vercel)
 *   npm run build:static  → static export into ./out for the Capacitor APK wrap
 *
 * A static export cannot run API routes, so the exported bundle talks to a
 * hosted backend through NEXT_PUBLIC_API_BASE (see .env.example).
 */
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  // A build shares .next with a running dev server and corrupts it. Set
  // NEXT_DIST_DIR to build or start from somewhere else instead.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // The static export has no image optimiser, so URLs pass through as-is.
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536, 1920],
  },
  // better-sqlite3 is a native module: keep it out of the server bundle.
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
