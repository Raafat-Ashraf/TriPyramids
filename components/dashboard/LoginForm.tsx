'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, AlertCircle } from 'lucide-react';

import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { DashLocaleSwitcher } from './DashLocaleSwitcher';

export function LoginForm() {
  const t = useTranslations('dashboard.login');
  const tBrand = useTranslations('dashboard');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      // On success this redirects server-side; only failure returns here.
      const result = await login(formData);
      if (result?.error) setError(true);
    });
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-sky-pharaoh px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <DashLocaleSwitcher />
        </div>

        <div className="rounded-2xl border border-pharaoh-gold/20 bg-pharaoh-black/70 p-8 shadow-gold backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt={tBrand('brand')} className="h-20 w-auto" />
            <h1 className="mt-5 font-display text-2xl font-bold text-pharaoh-cream">
              {t('title')}
            </h1>
            <p className="mt-1.5 text-sm text-pharaoh-cream/55">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium text-pharaoh-cream/80"
              >
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-pharaoh-gold/60" />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder={t('passwordPlaceholder')}
                  className="w-full rounded-xl border border-pharaoh-gold/20 bg-pharaoh-black/60 py-3 pe-4 ps-10 text-pharaoh-cream placeholder:text-pharaoh-cream/35 focus:border-pharaoh-gold focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                {t('error')}
              </div>
            )}

            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending ? t('signingIn') : t('submit')}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
