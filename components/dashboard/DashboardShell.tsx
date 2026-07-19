'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Map, Star, ExternalLink, LogOut } from 'lucide-react';

import { logout } from '@/app/actions/auth';
import { cn } from '@/lib/utils';
import { DashLocaleSwitcher } from './DashLocaleSwitcher';

const NAV = [
  { key: 'trips', href: '/dashboard', icon: Map },
  { key: 'reviews', href: '/dashboard/reviews', icon: Star },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col border-b border-pharaoh-gold/12 bg-pharaoh-black md:border-b-0 md:border-e md:border-pharaoh-gold/12">
        <div className="flex items-center gap-2.5 px-6 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-auto mix-blend-lighten"
          />
          <span className="font-display text-sm font-semibold text-pharaoh-cream/85">
            {t('brand')}
          </span>
        </div>

        <nav className="flex gap-1 px-4 pb-4 md:flex-col">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors md:flex-none',
                  active
                    ? 'bg-pharaoh-gold/15 text-pharaoh-gold'
                    : 'text-pharaoh-cream/65 hover:bg-pharaoh-gold/8 hover:text-pharaoh-cream',
                )}
              >
                <Icon className="size-4.5" />
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-pharaoh-gold/12 bg-pharaoh-black/80 px-5 py-3 backdrop-blur-sm sm:px-8">
          <DashLocaleSwitcher />
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-pharaoh-cream/70 transition-colors hover:bg-pharaoh-gold/10 hover:text-pharaoh-gold"
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">{t('nav.viewSite')}</span>
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-pharaoh-gold/25 px-3 py-2 text-sm font-medium text-pharaoh-cream/80 transition-colors hover:border-pharaoh-gold hover:text-pharaoh-gold"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
