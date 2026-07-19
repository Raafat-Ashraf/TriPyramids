'use client';

import { useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle } from 'lucide-react';

import { submitReview, type ReviewSubmitStatus } from '@/app/actions/reviews';
import { Button } from '@/components/ui/Button';
import { StarRatingInput } from '@/components/ui/StarRating';

const fieldClass =
  'w-full rounded-xl border border-pharaoh-gold/20 bg-pharaoh-black/60 px-4 py-3 text-pharaoh-cream ' +
  'placeholder:text-pharaoh-cream/35 transition-colors focus:border-pharaoh-gold focus:outline-none';

export function ReviewForm({ tripId }: { tripId?: string }) {
  const t = useTranslations('reviews.form');
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<ReviewSubmitStatus | null>(null);
  // Bumped on success so the star picker (React-controlled) remounts and clears.
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitReview(formData);
      setStatus(result.status);
      if (result.status === 'success') {
        formRef.current?.reset();
        setFormKey((key) => key + 1);
      }
    });
  }

  const errorMessage =
    status === 'validation'
      ? t('errorValidation')
      : status === 'rate'
        ? t('errorRate')
        : status === 'error'
          ? t('errorGeneric')
          : null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-pharaoh-gold/15 bg-pharaoh-gold/[0.03] p-6 sm:p-8"
    >
      <h3 className="font-display text-2xl font-bold text-pharaoh-cream">
        {t('title')}
      </h3>
      <p className="mt-1.5 text-sm text-pharaoh-cream/55">{t('subtitle')}</p>

      {tripId && <input type="hidden" name="tripId" value={tripId} />}

      {/* Honeypot — hidden from humans; a filled value flags a bot. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-pharaoh-cream/80">
              {t('name')} <span className="text-pharaoh-gold">*</span>
            </label>
            <input
              id="review-name"
              name="name"
              required
              maxLength={120}
              placeholder={t('namePlaceholder')}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="review-email" className="mb-1.5 block text-sm font-medium text-pharaoh-cream/80">
              {t('email')}{' '}
              <span className="text-xs font-normal text-pharaoh-cream/40">
                ({t('emailOptional')})
              </span>
            </label>
            <input
              id="review-email"
              name="email"
              type="email"
              maxLength={200}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-pharaoh-cream/80">
            {t('rating')} <span className="text-pharaoh-gold">*</span>
          </span>
          <StarRatingInput key={formKey} name="rating" label={t('rating')} />
        </div>

        <div>
          <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-pharaoh-cream/80">
            {t('comment')} <span className="text-pharaoh-gold">*</span>
          </label>
          <textarea
            id="review-comment"
            name="comment"
            required
            rows={4}
            maxLength={2000}
            placeholder={t('commentPlaceholder')}
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      {status === 'success' && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-pharaoh-gold/30 bg-pharaoh-gold/10 p-4 text-sm text-pharaoh-cream">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-pharaoh-gold" />
          <p>{t('success')}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
