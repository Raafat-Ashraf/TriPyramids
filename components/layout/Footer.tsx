import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { GlyphDivider } from '@/components/Glyphs';
import { LogoMark } from '@/components/brand/LogoMark';

const EXPLORE = [
  { key: 'home', href: '/' },
  { key: 'trips', href: '/#trips' },
  { key: 'reviews', href: '/#reviews' },
] as const;

export function Footer() {
  const t = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t border-pharaoh-gold/12 bg-pharaoh-black text-pharaoh-cream"
    >
      <div className="shell py-14">
        <GlyphDivider className="mb-12" />

        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-12 w-auto" />
              <span className="whitespace-nowrap font-display text-xl font-bold uppercase leading-none tracking-wide">
                <span className="text-pharaoh-gold">Tri</span>
                <span className="text-pharaoh-cream">Pyramids</span>
              </span>
              <span className="sr-only">{t('brandName')}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-pharaoh-cream/75">
              {t('footer.blurb')}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-pharaoh-gold/80">
              {t('tagline')}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-pharaoh-gold">
              {t('footer.explore')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-pharaoh-cream/70 transition-colors hover:text-pharaoh-gold"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-pharaoh-gold">
              {t('footer.contact')}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-pharaoh-cream/70">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-pharaoh-gold" />
                <a
                  href={`mailto:${t('footer.email')}`}
                  className="transition-colors hover:text-pharaoh-gold"
                >
                  {t('footer.email')}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-pharaoh-gold" />
                <a
                  href={`tel:${t('footer.phone').replace(/\s/g, '')}`}
                  className="transition-colors hover:text-pharaoh-gold"
                  dir="ltr"
                >
                  {t('footer.phone')}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-pharaoh-gold" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-pharaoh-gold/12 pt-6 text-xs text-pharaoh-cream/60 sm:flex-row">
          <p>
            © {year} {t('brandName')}. {t('footer.rights')}
          </p>
          <p>{t('footer.madeWith')}</p>
        </div>
      </div>
    </footer>
  );
}
