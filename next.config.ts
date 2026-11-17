import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // lets a production build run next to `npm run dev` (NEXT_DIST_DIR=.next-build) without touching its .next folder
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // Product photos live in public/products; admin uploads (day 2) go to Cloudinary.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
    // 90 is used where product photos are shown large (home line-up cards)
    qualities: [75, 90],
  },
};

export default withNextIntl(nextConfig);
