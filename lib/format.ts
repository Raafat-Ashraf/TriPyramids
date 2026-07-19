import type { Locale } from '@/i18n/routing';

function intlLocale(locale: string): string {
  return locale === 'ar' ? 'ar-EG' : 'en-US';
}

/**
 * Format a price as USD. Digits stay Latin in both locales (numberingSystem:
 * 'latn') so prices read consistently across the site.
 */
export function formatPrice(value: number | null | undefined, locale: Locale): string {
  if (value == null) return '';
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    numberingSystem: 'latn',
  }).format(value);
}

/** Format an ISO timestamp as a short readable date. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    numberingSystem: 'latn',
  }).format(new Date(iso));
}
