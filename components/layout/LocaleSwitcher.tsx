'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/**
 * AR / EN toggle. `usePathname` returns the path without the locale prefix, so
 * switching keeps the visitor on the same page in the other language.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');

  const linkClass = (active: boolean) =>
    cn(
      'rounded px-1.5 py-0.5 text-sm font-semibold transition-colors',
      active
        ? 'text-pharaoh-gold'
        : 'text-pharaoh-cream/55 hover:text-pharaoh-cream',
    );

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="group"
      aria-label={t('language')}
    >
      <Link
        href={pathname}
        locale="ar"
        aria-current={locale === 'ar' ? 'true' : undefined}
        className={linkClass(locale === 'ar')}
      >
        {t('switchToArabic')}
      </Link>
      <span aria-hidden="true" className="text-pharaoh-cream/25">
        /
      </span>
      <Link
        href={pathname}
        locale="en"
        aria-current={locale === 'en' ? 'true' : undefined}
        className={linkClass(locale === 'en')}
      >
        {t('switchToEnglish')}
      </Link>
    </div>
  );
}
