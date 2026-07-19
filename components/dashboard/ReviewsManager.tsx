'use client';

import { useMemo, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';

import { setReviewStatus, deleteReview } from '@/app/actions/admin-reviews';
import type { Locale } from '@/i18n/routing';
import type { ReviewStatus, ReviewWithTrip } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';

type Filter = 'all' | ReviewStatus;
const FILTERS: Filter[] = ['all', 'pending', 'approved', 'rejected'];
const STATUS_ORDER: Record<ReviewStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

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
  const [filter, setFilter] = useState<Filter>('all');

  // Pending first, then approved, then rejected; newest first within a group.
  const sorted = useMemo(() => {
    const list =
      filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);
    return [...list].sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (byStatus !== 0) return byStatus;
      return b.created_at.localeCompare(a.created_at);
    });
  }, [reviews, filter]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: reviews.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    for (const review of reviews) base[review.status] += 1;
    return base;
  }, [reviews]);

  function runAction(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  function changeStatus(id: string, status: ReviewStatus) {
    const formData = new FormData();
    formData.set('id', id);
    formData.set('status', status);
    runAction(() => setReviewStatus(formData));
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

      {/* Filter tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              filter === value
                ? 'border-pharaoh-gold bg-pharaoh-gold/15 text-pharaoh-gold'
                : 'border-pharaoh-gold/20 text-pharaoh-cream/65 hover:border-pharaoh-gold/50 hover:text-pharaoh-cream',
            )}
          >
            {t(`filter.${value}`)}
            <span className="ms-2 text-xs text-pharaoh-cream/45">{counts[value]}</span>
          </button>
        ))}
      </div>

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
                className={cn(
                  'rounded-2xl border bg-pharaoh-black/40 p-5 transition-colors',
                  review.status === 'pending'
                    ? 'border-pharaoh-gold/35 bg-pharaoh-gold/[0.05]'
                    : 'border-pharaoh-gold/12',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display font-semibold text-pharaoh-cream">
                        {review.name}
                      </span>
                      <StarRating value={review.rating} size={15} />
                      <span
                        className={cn(
                          'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                          STATUS_STYLES[review.status],
                        )}
                      >
                        {t(`status.${review.status}`)}
                      </span>
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
                    {review.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => changeStatus(review.id, 'approved')}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/15 disabled:opacity-50"
                      >
                        <Check className="size-3.5" />
                        {t('approve')}
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => changeStatus(review.id, 'rejected')}
                        disabled={pending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-pharaoh-gold/30 px-3 py-1.5 text-xs font-medium text-pharaoh-cream/75 transition-colors hover:bg-pharaoh-gold/10 disabled:opacity-50"
                      >
                        <X className="size-3.5" />
                        {t('reject')}
                      </button>
                    )}
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
