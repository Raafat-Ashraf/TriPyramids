import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { cairo, poppins, playfair } from '@/app/fonts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: {
      default: `${t('brandName')} — ${t('tagline')}`,
      template: `%s · ${t('brandName')}`,
    },
    description: t('footer.blurb'),
    icons: { icon: '/logo.png' },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'common.a11y' });
  const isArabic = locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';
  const sansClass = isArabic ? cairo.variable : poppins.variable;

  return (
    <html lang={locale} dir={dir} className={`${sansClass} ${playfair.variable}`}>
      <body className="flex min-h-dvh flex-col bg-pharaoh-black">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-full bg-pharaoh-gold px-5 py-2.5 font-semibold text-pharaoh-black focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
          >
            {t('skipToContent')}
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
