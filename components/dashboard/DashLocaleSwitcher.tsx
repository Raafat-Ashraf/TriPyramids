'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';

const LOCALES = ['ar', 'en', 'ru', 'it'] as const;
type DashLocale = (typeof LOCALES)[number];

/**
 * Switches the dashboard language by writing the `dash_locale` cookie and
 * refreshing, which re-runs the server layout that reads it.
 */
export function DashLocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();
  const [, startTransition] = useTransition();

  const labels: Record<DashLocale, string> = {
    ar: t('switchToArabic'),
    en: t('switchToEnglish'),
    ru: t('switchToRussian'),
    it: t('switchToItalian'),
  };

  function setLocale(next: DashLocale) {
    if (next === locale) return;
    document.cookie = `dash_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => router.refresh());
  }

  const btn = (active: boolean) =>
    cn(
      'rounded px-1.5 py-0.5 text-sm font-semibold transition-colors',
      active ? 'text-pharaoh-gold' : 'text-pharaoh-cream/50 hover:text-pharaoh-cream',
    );

  return (
    <div className="flex flex-wrap items-center gap-1" role="group" aria-label={t('language')}>
      {LOCALES.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && <span className="text-pharaoh-cream/25">/</span>}
          <button
            type="button"
            className={btn(locale === code)}
            aria-current={locale === code ? 'true' : undefined}
            onClick={() => setLocale(code)}
          >
            {labels[code]}
          </button>
        </span>
      ))}
    </div>
  );
}
