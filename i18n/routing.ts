import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing for the public site.
 *
 * `always` prefixes every public URL (`/ar/...`, `/en/...`) and defaults `/`
 * to Arabic. The admin area at `/dashboard` lives outside these routes and is
 * excluded from the intl middleware (see middleware.ts).
 */
export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
