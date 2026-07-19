'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

import { createTrip, updateTrip } from '@/app/actions/admin-trips';
import type { Trip } from '@/lib/types';
import { Button } from '@/components/ui/Button';

const field =
  'w-full rounded-lg border border-pharaoh-gold/20 bg-pharaoh-black/60 px-3.5 py-2.5 text-sm text-pharaoh-cream ' +
  'placeholder:text-pharaoh-cream/30 focus:border-pharaoh-gold focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-pharaoh-cream/80';

export function TripForm({
  trip,
  onClose,
}: {
  trip?: Trip;
  onClose: () => void;
}) {
  const t = useTranslations('dashboard.trips');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = trip
        ? await updateTrip(formData)
        : await createTrip(formData);
      if (result.ok) {
        router.refresh();
        onClose();
      } else {
        setError(result.error ?? 'Error');
      }
    });
  }

  return (
    <div className="rounded-2xl border border-pharaoh-gold/20 bg-pharaoh-gold/[0.04] p-6">
      <h3 className="font-display text-lg font-bold text-pharaoh-cream">
        {trip ? t('editTitle') : t('newTitle')}
      </h3>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {trip && <input type="hidden" name="id" value={trip.id} />}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="title_en">
              {t('fields.titleEn')} <span className="text-pharaoh-gold">*</span>
            </label>
            <input
              id="title_en"
              name="title_en"
              required
              dir="ltr"
              defaultValue={trip?.title_en ?? ''}
              className={field}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="title_ar">
              {t('fields.titleAr')} <span className="text-pharaoh-gold">*</span>
            </label>
            <input
              id="title_ar"
              name="title_ar"
              required
              dir="rtl"
              defaultValue={trip?.title_ar ?? ''}
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="description_en">
              {t('fields.descEn')}
            </label>
            <textarea
              id="description_en"
              name="description_en"
              rows={4}
              dir="ltr"
              defaultValue={trip?.description_en ?? ''}
              className={`${field} resize-y`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="description_ar">
              {t('fields.descAr')}
            </label>
            <textarea
              id="description_ar"
              name="description_ar"
              rows={4}
              dir="rtl"
              defaultValue={trip?.description_ar ?? ''}
              className={`${field} resize-y`}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="location">
              {t('fields.location')}
            </label>
            <input
              id="location"
              name="location"
              defaultValue={trip?.location ?? ''}
              className={field}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="duration_days">
              {t('fields.duration')}
            </label>
            <input
              id="duration_days"
              name="duration_days"
              type="number"
              min="0"
              step="1"
              dir="ltr"
              defaultValue={trip?.duration_days ?? ''}
              className={field}
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="image_url">
            {t('fields.imageUrl')}
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            dir="ltr"
            placeholder="https://…"
            defaultValue={trip?.image_url ?? ''}
            className={field}
          />
          <p className="mt-1.5 text-xs text-pharaoh-cream/45">
            {t('fields.imageHint')}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? t('saving') : t('save')}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-pharaoh-cream/70 transition-colors hover:text-pharaoh-cream"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
