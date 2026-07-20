import type { Locale } from '@/i18n/routing';

const INTL_LOCALES: Record<Locale, string> = {
  ar: 'ar-EG',
  en: 'en-US',
  ru: 'ru-RU',
  it: 'it-IT',
};

/** Map a site locale to the BCP-47 tag Intl.* APIs expect. */
export function intlLocale(locale: string): string {
  return INTL_LOCALES[locale as Locale] ?? 'en-US';
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
