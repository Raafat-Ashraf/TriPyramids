'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AlertCircle, ImagePlus, X } from 'lucide-react';

import { createTrip, updateTrip } from '@/app/actions/admin-trips';
import type { Trip } from '@/lib/types';
import { parseTripImages } from '@/lib/trip-images';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const MAX_IMAGES = 8;

const field =
  'w-full rounded-lg border border-pharaoh-gold/20 bg-pharaoh-black/60 px-3.5 py-2.5 text-sm text-pharaoh-cream ' +
  'placeholder:text-pharaoh-cream/30 focus:border-pharaoh-gold focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-medium text-pharaoh-cream/80';

// Arabic and English are required (the original two-language schema); Russian
// and Italian are optional add-ons that fall back to English on the site when
// left blank (see lib/trip-i18n.ts).
const LANGS = [
  { code: 'ar', dir: 'rtl', required: true },
  { code: 'en', dir: 'ltr', required: true },
  { code: 'ru', dir: 'ltr', required: false },
  { code: 'it', dir: 'ltr', required: false },
] as const;
type LangCode = (typeof LANGS)[number]['code'];

const TITLE_FIELD: Record<LangCode, 'title_ar' | 'title_en' | 'title_ru' | 'title_it'> = {
  ar: 'title_ar',
  en: 'title_en',
  ru: 'title_ru',
  it: 'title_it',
};
const DESC_FIELD: Record<
  LangCode,
  'description_ar' | 'description_en' | 'description_ru' | 'description_it'
> = {
  ar: 'description_ar',
  en: 'description_en',
  ru: 'description_ru',
  it: 'description_it',
};
const NATIVE_LABEL_KEY: Record<LangCode, string> = {
  ar: 'switchToArabic',
  en: 'switchToEnglish',
  ru: 'switchToRussian',
  it: 'switchToItalian',
};

/** 'ar' -> 'Ar', matching the `fields.title{Ar,En,Ru,It}` message key suffix. */
function capitalize(code: string): string {
  return code.charAt(0).toUpperCase() + code.slice(1);
}

export function TripForm({
  trip,
  onClose,
}: {
  trip?: Trip;
  onClose: () => void;
}) {
  const t = useTranslations('dashboard.trips');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<LangCode>('ar');

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

        <div>
          <p className="mb-3 text-xs text-pharaoh-cream/45">{t('translationsHint')}</p>

          {/* Language tabs. All four panes stay mounted (just hidden) so
              switching tabs never loses what's been typed in the others. */}
          <div className="flex flex-wrap gap-1.5 border-b border-pharaoh-gold/15 pb-2">
            {LANGS.map((lang) => {
              const hasContent = Boolean(trip?.[TITLE_FIELD[lang.code]]);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setActiveLang(lang.code)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    activeLang === lang.code
                      ? 'bg-pharaoh-gold/15 text-pharaoh-gold'
                      : 'text-pharaoh-cream/60 hover:text-pharaoh-cream',
                  )}
                >
                  {tCommon(NATIVE_LABEL_KEY[lang.code])}
                  {lang.required && <span className="text-pharaoh-gold">*</span>}
                  {!lang.required && hasContent && (
                    <span
                      className="size-1.5 rounded-full bg-emerald-400"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-5">
            {LANGS.map((lang) => (
              <div
                key={lang.code}
                className={cn('grid gap-5', activeLang !== lang.code && 'hidden')}
              >
                <div>
                  <label className={labelClass} htmlFor={`title_${lang.code}`}>
                    {t(`fields.title${capitalize(lang.code)}`)}{' '}
                    {lang.required && <span className="text-pharaoh-gold">*</span>}
                  </label>
                  <input
                    id={`title_${lang.code}`}
                    name={`title_${lang.code}`}
                    required={lang.required}
                    dir={lang.dir}
                    defaultValue={trip?.[TITLE_FIELD[lang.code]] ?? ''}
                    className={field}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`description_${lang.code}`}>
                    {t(`fields.desc${capitalize(lang.code)}`)}
                  </label>
                  <textarea
                    id={`description_${lang.code}`}
                    name={`description_${lang.code}`}
                    rows={4}
                    dir={lang.dir}
                    defaultValue={trip?.[DESC_FIELD[lang.code]] ?? ''}
                    className={`${field} resize-y`}
                  />
                </div>
              </div>
            ))}
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
