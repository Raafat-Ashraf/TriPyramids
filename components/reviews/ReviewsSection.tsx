import { useTranslations } from 'next-intl';

import type { Review } from '@/lib/types';
import { SectionHeading } from '@/components/SectionHeading';
import { ReviewCard } from './ReviewCard';

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('reviews');

  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-t border-pharaoh-gold/10 bg-gradient-to-b from-pharaoh-black to-[#140F06] py-20 sm:py-28"
    >
      <div className="shell">
        <SectionHeading
          eyebrow={t('sectionEyebrow')}
          title={t('sectionTitle')}
          subtitle={t('sectionSubtitle')}
        />

        {reviews.length === 0 ? (
          <p className="mt-16 text-center text-pharaoh-cream/50">{t('empty')}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
