import { Cairo, Poppins, Inter, Playfair_Display } from 'next/font/google';

/**
 * Shared font instances for both root layouts (public + dashboard).
 *
 * Cairo, Poppins and Inter all expose `--font-sans`; only one class is ever
 * placed on <html> per locale, so exactly one wins:
 *  - Arabic  → Cairo (arabic + latin)
 *  - English/Italian → Poppins (latin, latin-ext for accented Italian letters)
 *  - Russian → Inter (Poppins has no Cyrillic subset on Google Fonts; Inter does)
 * Playfair provides `--font-serif` for headings and wordmark areas, echoing the
 * logo — it supports both latin and cyrillic, so Russian headings render in it
 * too rather than silently falling back to a system serif.
 */
export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});
