import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, Clock, Tag } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Review, Trip } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { GlyphDivider, SunDisk } from '@/components/Glyphs';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';

export function TripDetail({
  trip,
  reviews,
}: {
  trip: Trip;
  reviews: Review[];
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('trips');
  const tr = useTranslations('trips.detail');

  const title = locale === 'ar' ? trip.title_ar : trip.title_en;
  const description =
    (locale === 'ar' ? trip.description_ar : trip.description_en) ?? '';

  return (
    <div className="bg-pharaoh-black pt-[var(--header-height)]">
      {/* Banner */}
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        {trip.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image_url}
            alt={title}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-pharaoh-goldDark/30 via-pharaoh-black to-pharaoh-black">
            <SunDisk size={90} className="text-pharaoh-gold/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pharaoh-black via-pharaoh-black/50 to-pharaoh-black/30" />

        <div className="shell absolute inset-x-0 bottom-0">
          <div className="pb-8">
            <Link
              href="/#trips"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-pharaoh-cream/70 transition-colors hover:text-pharaoh-gold"
            >
              <ArrowLeft className="size-4 rtl:-scale-x-100" />
              {tr('back')}
            </Link>
            <h1 className="font-display text-4xl font-extrabold text-pharaoh-cream sm:text-5xl">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {trip.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pharaoh-gold/25 bg-pharaoh-black/50 px-3.5 py-1.5 text-sm text-pharaoh-cream backdrop-blur-sm">
                  <MapPin className="size-4 text-pharaoh-gold" />
                  {trip.location}
                </span>
              )}
              {trip.duration_days != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pharaoh-gold/25 bg-pharaoh-black/50 px-3.5 py-1.5 text-sm text-pharaoh-cream backdrop-blur-sm">
                  <Clock className="size-4 text-pharaoh-gold" />
                  {t('durationDays', { count: trip.duration_days })}
                </span>
              )}
              {trip.price != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pharaoh-gold/40 bg-pharaoh-gold/15 px-3.5 py-1.5 text-sm font-semibold text-pharaoh-gold backdrop-blur-sm">
                  <Tag className="size-4" />
                  {t('priceFrom')} {formatPrice(trip.price, locale)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      {description && (
        <section className="shell py-14">
          <h2 className="font-display text-2xl font-bold text-pharaoh-gold">
            {tr('overview')}
          </h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-pharaoh-cream/75">
            {description}
          </p>
        </section>
      )}

      <div className="shell">
        <GlyphDivider />
      </div>

      {/* Reviews for this trip */}
      <section className="shell py-14">
        <h2 className="font-display text-2xl font-bold text-pharaoh-cream sm:text-3xl">
          {tr('reviewsTitle')}
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-6 text-pharaoh-cream/55">{tr('noReviews')}</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* Submit a review */}
      <section className="shell pb-20">
        <div className="mx-auto max-w-2xl">
          <ReviewForm tripId={trip.id} />
        </div>
      </section>
    </div>
  );
}
