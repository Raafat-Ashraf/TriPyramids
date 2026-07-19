'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AlertCircle, ImagePlus, X } from 'lucide-react';

import { createTrip, updateTrip } from '@/app/actions/admin-trips';
import type { Trip } from '@/lib/types';
import { parseTripImages } from '@/lib/trip-images';
import { Button } from '@/components/ui/Button';

const MAX_IMAGES = 8;

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

  // Images the admin keeps (existing URLs) + newly picked files.
  const [existingImages, setExistingImages] = useState<string[]>(() =>
    parseTripImages(trip?.image_url),
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const newPreviews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles],
  );
  useEffect(
    () => () => newPreviews.forEach((p) => URL.revokeObjectURL(p.url)),
    [newPreviews],
  );

  const totalImages = existingImages.length + newFiles.length;

  function pickFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    );
    setNewFiles((prev) =>
      [...prev, ...picked].slice(0, MAX_IMAGES - existingImages.length),
    );
    event.target.value = '';
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    for (const url of existingImages) formData.append('existing_images', url);
    for (const file of newFiles) formData.append('images', file);
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
          <span className={labelClass}>{t('fields.images')}</span>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {existingImages.map((url) => (
              <ImageTile
                key={url}
                src={url}
                label={t('fields.removeImage')}
                onRemove={() =>
                  setExistingImages((prev) => prev.filter((u) => u !== url))
                }
              />
            ))}
            {newPreviews.map((preview, index) => (
              <ImageTile
                key={preview.url}
                src={preview.url}
                label={t('fields.removeImage')}
                onRemove={() =>
                  setNewFiles((prev) => prev.filter((_, i) => i !== index))
                }
              />
            ))}
            {totalImages < MAX_IMAGES && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-pharaoh-gold/30 bg-pharaoh-black/40 text-pharaoh-gold/70 transition-colors hover:border-pharaoh-gold hover:text-pharaoh-gold">
                <ImagePlus className="size-5" />
                <span className="text-[0.7rem] font-medium">
                  {t('fields.addImages')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={pickFiles}
                />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-pharaoh-cream/45">
            {t('fields.imagesHint')}
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

function ImageTile({
  src,
  label,
  onRemove,
}: {
  src: string;
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-pharaoh-gold/15 bg-pharaoh-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        aria-label={label}
        className="absolute end-1 top-1 flex size-6 items-center justify-center rounded-full bg-pharaoh-black/85 text-pharaoh-cream/90 transition-colors hover:bg-red-500/80 hover:text-white"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
