'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/brand/LogoMark';
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
  const [scrolled, setScrolled] = useState(false);

  // Solid/blurred header once scrolled past the hero's top band. The threshold
  // is compared against the current state so we only re-render on a crossing,
  // not on every scroll event.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out motion-reduce:transition-none',
        scrolled
          ? 'border-b border-pharaoh-gold/15 bg-pharaoh-black/95 shadow-lift backdrop-blur-md'
          : // At the top the bar stays out of the way: no fill, no border — just a
            // soft scrim so the nav keeps its contrast over the hero photograph.
            'border-b border-transparent bg-gradient-to-b from-pharaoh-black/70 via-pharaoh-black/30 to-transparent',
      )}
    >
      <div
        className={cn(
          'shell flex items-center justify-between gap-4 transition-[height] duration-300 ease-out motion-reduce:transition-none',
          scrolled ? 'h-[3.75rem]' : 'h-[var(--header-height)]',
        )}
      >
        {/* Brand lockup — identical dimensions in every locale */}
        <Link
          href="/"
          aria-label={t('brandName')}
          className="group flex shrink-0 items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pharaoh-black"
          onClick={() => setOpen(false)}
        >
          <LogoMark
            className={cn(
              'w-auto transition-[height] duration-300 ease-out motion-reduce:transition-none',
              scrolled ? 'h-9' : 'h-11',
            )}
          />
          <span className="whitespace-nowrap font-display text-lg font-bold uppercase leading-none tracking-wide sm:text-xl">
            <span className="text-pharaoh-gold">Tri</span>
            <span className="text-pharaoh-cream">Pyramids</span>
          </span>
        </Link>

        <nav aria-label={t('a11y.mainNav')} className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded text-sm font-medium text-pharaoh-cream/85 transition-colors hover:text-pharaoh-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <button
            type="button"
            className="rounded-md p-2 text-pharaoh-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold md:hidden"
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={cn(
          'overflow-hidden border-t border-pharaoh-gold/12 bg-pharaoh-black transition-[max-height] duration-300 ease-out md:hidden',
          open ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav aria-label={t('a11y.mainNav')} className="shell flex flex-col gap-1 py-4">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-base font-medium text-pharaoh-cream/90 hover:bg-pharaoh-gold/10 hover:text-pharaoh-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold"
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
