'use client';

import { useMemo, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

import { deleteReview } from '@/app/actions/admin-reviews';
import type { Locale } from '@/i18n/routing';
import type { ReviewStatus, ReviewWithTrip } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';

// New reviews are always 'approved', but legacy rows may still carry other
// statuses — a badge is shown only when a review isn't approved.
const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: 'border-pharaoh-gold/40 bg-pharaoh-gold/15 text-pharaoh-gold',
  approved: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  rejected: 'border-red-500/40 bg-red-500/15 text-red-300',
};

export function ReviewsManager({ reviews }: { reviews: ReviewWithTrip[] }) {
  const t = useTranslations('dashboard.reviews');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [reviews],
  );

  function runAction(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  function removeReview(id: string) {
    if (!window.confirm(t('confirmDelete'))) return;
    const formData = new FormData();
    formData.set('id', id);
    runAction(() => deleteReview(formData));
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-pharaoh-cream sm:text-3xl">
        {t('title')}
      </h1>
      <p className="mt-1.5 text-sm text-pharaoh-cream/55">{t('subtitle')}</p>

      <div className="mt-6 space-y-3">
        {sorted.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-pharaoh-gold/20 py-16 text-center text-pharaoh-cream/50">
            {t('empty')}
          </p>
        ) : (
          sorted.map((review) => {
            const tripTitle = review.trips
              ? locale === 'ar'
                ? review.trips.title_ar
                : review.trips.title_en
              : t('generalTrip');
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-pharaoh-gold/12 bg-pharaoh-black/40 p-5 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display font-semibold text-pharaoh-cream">
                        {review.name}
                      </span>
                      <StarRating value={review.rating} size={15} />
                      {review.status !== 'approved' && (
                        <span
                          className={cn(
                            'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            STATUS_STYLES[review.status],
                          )}
                        >
                          {t(`status.${review.status}`)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-pharaoh-cream/45">
                      <span className="text-pharaoh-gold/70">{tripTitle}</span>
                      {' · '}
                      <span className="numeric">
                        {formatDate(review.created_at, locale)}
                      </span>
                      {review.email && (
                        <>
                          {' · '}
                          <span dir="ltr">{review.email}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeReview(review.id)}
                      disabled={pending}
                      className="rounded-lg p-2 text-pharaoh-cream/60 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                      aria-label={t('delete')}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-pharaoh-cream/80">
                  {review.comment}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
