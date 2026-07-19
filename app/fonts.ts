import { Cairo, Poppins, Playfair_Display } from 'next/font/google';

/**
 * Shared font instances for both root layouts (public + dashboard).
 *
 * Cairo and Poppins both expose `--font-sans`; only one class is ever placed on
 * <html> per locale, so exactly one wins. Playfair provides `--font-serif` for
 * headings and wordmark areas, echoing the logo.
 */
export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});
