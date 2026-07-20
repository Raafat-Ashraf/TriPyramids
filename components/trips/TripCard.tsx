import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Trip } from '@/lib/types';
import { parseTripImages } from '@/lib/trip-images';
import { getTripTitle, getTripDescription } from '@/lib/trip-i18n';
import { SunDisk } from '@/components/Glyphs';
import { BookButton } from './BookButton';
import { TripCardImages } from './TripCardImages';

export function TripCard({ trip }: { trip: Trip }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('trips');

  const title = getTripTitle(trip, locale);
  const description = getTripDescription(trip, locale);
  const images = parseTripImages(trip.image_url);

  return (
    // A plain container, not a link: the card holds two separate actions — the
    // detail link (image + text) and the WhatsApp "Book" button — so neither is
    // nested inside the other.
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-pharaoh-gold/15 bg-gradient-to-b from-pharaoh-gold/[0.06] to-transparent transition-all duration-300 hover:-translate-y-1.5 hover:border-pharaoh-gold/50 hover:shadow-gold-lg">
      <Link
        href={`/trips/${trip.id}`}
        className="flex flex-1 flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pharaoh-black"
      >
        {/* Image — auto-cycles through the trip's photos when there's more than one */}
        <div className="relative aspect-[16/10] overflow-hidden bg-pharaoh-black">
          {images.length > 0 ? (
            <TripCardImages images={images} alt={title} />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-pharaoh-goldDark/30 via-pharaoh-black to-pharaoh-black">
              <SunDisk size={56} className="text-pharaoh-gold/40" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pharaoh-black/70 via-transparent to-transparent" />
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
          <h3 className="font-display text-xl font-bold text-pharaoh-cream transition-colors group-hover:text-pharaoh-goldLight">
            {title}
          </h3>
          {description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-pharaoh-cream/70">
              {description}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pharaoh-gold transition-all group-hover:gap-2">
            {t('viewTrip')}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </span>
        </div>
      </Link>

      {/* Book — opens WhatsApp with this trip's name */}
      <div className="border-t border-pharaoh-gold/10 p-5">
        <BookButton tripTitle={title} className="w-full" />
      </div>
    </article>
  );
}
