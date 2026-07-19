'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { LocaleSwitcher } from './LocaleSwitcher';

const NAV = [
  { key: 'home', href: '/' },
  { key: 'trips', href: '/#trips' },
  { key: 'reviews', href: '/#reviews' },
  { key: 'contact', href: '/#contact' },
] as const;

export function Header() {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-pharaoh-gold/12 bg-pharaoh-black/85 backdrop-blur-md">
      <div className="shell flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          {/* Horizontal lockup: the cropped pyramid+sun icon (its black backing
              drops out via `lighten` so only the gold reads on the header) plus
              the wordmark set in the logo's own gold/cream serif style. */}
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-auto mix-blend-lighten sm:h-10"
          />
          <span className="font-display text-lg font-bold uppercase leading-none tracking-wide sm:text-xl">
            <span className="text-pharaoh-gold">Tri</span>
            <span className="text-pharaoh-cream">Pyramids</span>
          </span>
          <span className="sr-only">{t('brandName')}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-pharaoh-cream/80 transition-colors hover:text-pharaoh-gold"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <button
            type="button"
            className="rounded-md p-2 text-pharaoh-gold md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-pharaoh-gold/12 bg-pharaoh-black md:hidden',
          open ? 'max-h-96' : 'max-h-0',
          'transition-[max-height] duration-300 ease-out',
        )}
      >
        <nav className="shell flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-base font-medium text-pharaoh-cream/85 hover:bg-pharaoh-gold/10 hover:text-pharaoh-gold"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="mt-2 px-2">
            <LocaleSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
