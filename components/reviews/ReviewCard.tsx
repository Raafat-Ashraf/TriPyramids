import { useLocale } from 'next-intl';
import { Quote } from 'lucide-react';

import type { Locale } from '@/i18n/routing';
import type { Review } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { StarRating } from '@/components/ui/StarRating';

export function ReviewCard({ review }: { review: Review }) {
  const locale = useLocale() as Locale;

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-pharaoh-gold/15 bg-gradient-to-b from-pharaoh-gold/[0.05] to-transparent p-6">
      <div className="flex items-center justify-between">
        <StarRating value={review.rating} size={18} />
        <Quote className="size-6 text-pharaoh-gold/25 rtl:-scale-x-100" />
      </div>
      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-pharaoh-cream/80">
        “{review.comment}”
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between border-t border-pharaoh-gold/10 pt-4">
        <span className="font-display font-semibold text-pharaoh-cream">
          {review.name}
        </span>
        <span className="numeric text-xs text-pharaoh-cream/45">
          {formatDate(review.created_at, locale)}
        </span>
      </figcaption>
    </figure>
  );
}
