import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';

import { cairo, poppins, inter, playfair } from '@/app/fonts';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';
import ruMessages from '@/messages/ru.json';
import itMessages from '@/messages/it.json';
import '../globals.css';

const DASH_LOCALES = ['ar', 'en', 'ru', 'it'] as const;
type DashLocale = (typeof DASH_LOCALES)[number];

const DASH_MESSAGES: Record<DashLocale, typeof enMessages> = {
  ar: arMessages,
  en: enMessages,
  ru: ruMessages,
  it: itMessages,
};

export const metadata: Metadata = {
  title: 'TriPyramids Admin',
  robots: { index: false, follow: false },
};

/**
 * Root layout for the admin area — a separate <html> tree from the public site.
 *
 * The dashboard is NOT locale-routed; it keeps its own language in a `dash_locale`
 * cookie (default Arabic) and provides messages directly to next-intl, so the
 * same four-language dictionaries (ar/en/ru/it) drive both areas.
 */
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieLocale = cookies().get('dash_locale')?.value;
  const dashLocale: DashLocale = DASH_LOCALES.includes(cookieLocale as DashLocale)
    ? (cookieLocale as DashLocale)
    : 'ar';
  const isArabic = dashLocale === 'ar';
  const messages = DASH_MESSAGES[dashLocale];
  const sansClass =
    dashLocale === 'ar' ? cairo.variable : dashLocale === 'ru' ? inter.variable : poppins.variable;

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
