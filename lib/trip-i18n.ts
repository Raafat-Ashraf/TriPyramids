import type { Locale } from '@/i18n/routing';
import type { Trip } from '@/lib/types';

// Pick-based rather than the full `Trip`, so the same helper works both for a
// complete trip row and for the narrower `ReviewWithTrip.trips` shape (which
// only ever selects the title columns).
type TitleSource = Pick<Trip, 'title_ar' | 'title_en' | 'title_ru' | 'title_it'>;
type DescriptionSource = Pick<
  Trip,
  'description_ar' | 'description_en' | 'description_ru' | 'description_it'
>;

/**
 * Trip content is authored per-language in the dashboard, but Russian and
 * Italian are optional — an admin may not have translated a trip into them
 * yet. Falling back to English (then Arabic) means a trip always has a title,
 * even before it's fully translated, instead of rendering blank.
 */
export function getTripTitle(trip: TitleSource, locale: Locale): string {
  switch (locale) {
    case 'ar':
      return trip.title_ar || trip.title_en;
    case 'ru':
      return trip.title_ru || trip.title_en || trip.title_ar;
    case 'it':
      return trip.title_it || trip.title_en || trip.title_ar;
    case 'en':
    default:
      return trip.title_en || trip.title_ar;
  }
}

export function getTripDescription(trip: DescriptionSource, locale: Locale): string {
  switch (locale) {
    case 'ar':
      return trip.description_ar || trip.description_en || '';
    case 'ru':
      return trip.description_ru || trip.description_en || trip.description_ar || '';
    case 'it':
      return trip.description_it || trip.description_en || trip.description_ar || '';
    case 'en':
    default:
      return trip.description_en || trip.description_ar || '';
  }
}
