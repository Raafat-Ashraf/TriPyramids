import { useTranslations } from 'next-intl';
import { MessageSquareQuote } from 'lucide-react';

import type { Review } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import { EmptyState } from '@/components/EmptyState';
import { ReviewCard } from './ReviewCard';

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('reviews');
  const nav = useTranslations('common.nav');

  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-t border-pharaoh-gold/10 bg-gradient-to-b from-pharaoh-black to-[#140F06] py-20 md:py-28"
    >
      <div className="shell">
        <SectionHeading
          eyebrow={t('sectionEyebrow')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        {reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareQuote className="size-7" />}
            title={t('emptyTitle')}
            description={t('empty')}
            ctaLabel={nav('contact')}
            ctaHref="/#contact"
          />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
