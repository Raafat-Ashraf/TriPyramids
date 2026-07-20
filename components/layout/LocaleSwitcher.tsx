'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Globe } from 'lucide-react';

import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LOCALES: Locale[] = ['ar', 'en', 'ru', 'it'];
const CODES: Record<Locale, string> = { ar: 'AR', en: 'EN', ru: 'RU', it: 'IT' };

/**
 * Language switcher for the public site. A compact button showing the active
 * locale's code opens a dropdown listing all four languages by their native
 * name — four inline text links (the AR/EN pattern this replaced) stopped
 * fitting comfortably once Russian and Italian were added, especially in the
 * header's tight flex row. `usePathname` returns the path without the locale
 * prefix, so switching keeps the visitor on the same page.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const nativeName: Record<Locale, string> = {
    ar: t('switchToArabic'),
    en: t('switchToEnglish'),
    ru: t('switchToRussian'),
    it: t('switchToItalian'),
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('language')}
        className="flex items-center gap-1.5 rounded-full border border-pharaoh-gold/25 px-3 py-1.5 text-sm font-semibold text-pharaoh-cream/85 transition-colors hover:border-pharaoh-gold/50 hover:text-pharaoh-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold"
      >
        <Globe className="size-3.5 text-pharaoh-gold" aria-hidden="true" />
        {CODES[locale]}
        <ChevronDown
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-pharaoh-gold/20 bg-pharaoh-black py-1.5 shadow-lift"
        >
          {LOCALES.map((code) => {
            const active = locale === code;
            return (
              <Link
                key={code}
                role="menuitem"
                href={pathname}
                locale={code}
                aria-current={active ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2 text-sm transition-colors',
                  active
                    ? 'text-pharaoh-gold'
                    : 'text-pharaoh-cream/80 hover:bg-pharaoh-gold/10 hover:text-pharaoh-cream',
                )}
              >
                <span>{nativeName[code]}</span>
                <span className="text-xs text-pharaoh-cream/40">{CODES[code]}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
