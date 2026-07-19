'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';

import { deleteTrip } from '@/app/actions/admin-trips';
import type { Locale } from '@/i18n/routing';
import type { Trip } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { TripForm } from './TripForm';

export function TripsManager({ trips }: { trips: Trip[] }) {
  const t = useTranslations('dashboard.trips');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // null = list view, 'new' = create form, Trip = edit that trip.
  const [editing, setEditing] = useState<Trip | 'new' | null>(null);

  function handleDelete(trip: Trip) {
    if (!window.confirm(t('confirmDelete'))) return;
    const formData = new FormData();
    formData.set('id', trip.id);
    startTransition(async () => {
      await deleteTrip(formData);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-pharaoh-cream sm:text-3xl">
            {t('title')}
          </h1>
          <p className="mt-1.5 text-sm text-pharaoh-cream/55">{t('subtitle')}</p>
        </div>
        {editing === null && (
          <Button onClick={() => setEditing('new')}>
            <Plus className="size-4" />
            {t('newButton')}
          </Button>
        )}
      </div>

      {editing !== null && (
        <div className="mt-6">
          <TripForm
            trip={editing === 'new' ? undefined : editing}
            onClose={() => setEditing(null)}
          />
        </div>
      )}

      <div className="mt-8">
        {trips.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-pharaoh-gold/20 py-16 text-center text-pharaoh-cream/50">
            {t('empty')}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-pharaoh-gold/12">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-pharaoh-gold/12 bg-pharaoh-gold/[0.04] text-start text-xs uppercase tracking-wider text-pharaoh-cream/55">
                  <th className="px-4 py-3 text-start font-semibold">{t('table.trip')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t('table.location')}</th>
                  <th className="px-4 py-3 text-start font-semibold">{t('table.duration')}</th>
                  <th className="px-4 py-3 text-end font-semibold">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-pharaoh-gold/8 last:border-0 hover:bg-pharaoh-gold/[0.03]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-pharaoh-black">
                          {trip.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={trip.image_url}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-pharaoh-gold/40">
                              <MapPin className="size-4" />
                            </span>
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-pharaoh-cream">
                            {locale === 'ar' ? trip.title_ar : trip.title_en}
                          </p>
                          <p className="truncate text-xs text-pharaoh-cream/45" dir={locale === 'ar' ? 'ltr' : 'rtl'}>
                            {locale === 'ar' ? trip.title_en : trip.title_ar}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-pharaoh-cream/70">
                      {trip.location ?? '—'}
                    </td>
                    <td className="px-4 py-3.5 text-pharaoh-cream/70">
                      {trip.duration_days != null
                        ? t('durationShort', { count: trip.duration_days })
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(trip)}
                          className="rounded-lg p-2 text-pharaoh-cream/70 transition-colors hover:bg-pharaoh-gold/10 hover:text-pharaoh-gold"
                          aria-label={t('edit')}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(trip)}
                          disabled={pending}
                          className="rounded-lg p-2 text-pharaoh-cream/70 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                          aria-label={t('delete')}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
