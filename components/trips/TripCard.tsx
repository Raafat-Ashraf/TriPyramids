import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Trip } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { SunDisk } from '@/components/Glyphs';

export function TripCard({ trip }: { trip: Trip }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('trips');

  const title = locale === 'ar' ? trip.title_ar : trip.title_en;
  const description =
    (locale === 'ar' ? trip.description_ar : trip.description_en) ?? '';

  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-pharaoh-gold/15 bg-gradient-to-b from-pharaoh-gold/[0.06] to-transparent transition-all duration-300 hover:-translate-y-1 hover:border-pharaoh-gold/45 hover:shadow-gold"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-pharaoh-black">
        {trip.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.image_url}
            alt={title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-pharaoh-goldDark/30 via-pharaoh-black to-pharaoh-black">
            <SunDisk size={56} className="text-pharaoh-gold/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pharaoh-black/70 via-transparent to-transparent" />
        {trip.duration_days != null && (
          <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-pharaoh-black/80 px-3 py-1 text-xs font-medium text-pharaoh-cream backdrop-blur-sm">
            <Clock className="size-3.5 text-pharaoh-gold" />
            {t('durationDays', { count: trip.duration_days })}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {trip.location && (
          <span className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-pharaoh-gold">
            <MapPin className="size-3.5" />
            {trip.location}
          </span>
        )}
        <h3 className="font-display text-xl font-bold text-pharaoh-cream">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-pharaoh-cream/60">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between border-t border-pharaoh-gold/10 pt-4">
          {trip.price != null ? (
            <div>
              <span className="block text-[0.7rem] uppercase tracking-wider text-pharaoh-cream/45">
                {t('priceFrom')}
              </span>
              <span className="numeric font-display text-lg font-bold text-pharaoh-gold">
                {formatPrice(trip.price, locale)}
              </span>
            </div>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-pharaoh-gold transition-transform group-hover:gap-2">
            {t('viewTrip')}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </span>
        </div>
      </div>
    </Link>
  );
}
