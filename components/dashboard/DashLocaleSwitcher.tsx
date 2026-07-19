'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';

/**
 * Switches the dashboard language by writing the `dash_locale` cookie and
 * refreshing, which re-runs the server layout that reads it.
 */
export function DashLocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function setLocale(next: 'ar' | 'en') {
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
    <div className="flex items-center gap-1">
      <button type="button" className={btn(locale === 'ar')} onClick={() => setLocale('ar')}>
        العربية
      </button>
      <span className="text-pharaoh-cream/25">/</span>
      <button type="button" className={btn(locale === 'en')} onClick={() => setLocale('en')}>
        EN
      </button>
    </div>
  );
}
