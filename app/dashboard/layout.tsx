import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';

import { cairo, poppins, playfair } from '@/app/fonts';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';
import '../globals.css';

export const metadata: Metadata = {
  title: 'TriPyramids Admin',
  robots: { index: false, follow: false },
};

/**
 * Root layout for the admin area — a separate <html> tree from the public site.
 *
 * The dashboard is NOT locale-routed; it keeps its own language in a `dash_locale`
 * cookie (default Arabic) and provides messages directly to next-intl, so the
 * same bilingual dictionaries drive both areas.
 */
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dashLocale =
    cookies().get('dash_locale')?.value === 'en' ? 'en' : 'ar';
  const isArabic = dashLocale === 'ar';
  const messages = isArabic ? arMessages : enMessages;
  const sansClass = isArabic ? cairo.variable : poppins.variable;

  return (
    <html
      lang={dashLocale}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`${sansClass} ${playfair.variable}`}
    >
      <body className="bg-pharaoh-black text-pharaoh-cream">
        <NextIntlClientProvider
          locale={dashLocale}
          messages={messages}
          timeZone="Africa/Cairo"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
