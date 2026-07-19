import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // We rely on the TypeScript compiler and CI for correctness; a missing
    // ESLint config should never fail a production build.
    ignoreDuringBuilds: true,
  },
  images: {
    // Trip images are arbitrary owner-provided URLs entered in the dashboard,
    // so we can't enumerate hosts up front. Cards use plain <img>, but keep
    // this permissive in case next/image is used for a known host later.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default withNextIntl(nextConfig);
