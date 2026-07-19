import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { GlyphDivider } from '@/components/Glyphs';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <GlyphDivider className="mb-8" />
      <p className="font-display text-7xl font-extrabold text-gold-gradient">404</p>
      <p className="mt-4 max-w-md text-pharaoh-cream/60">
        {t('footer.blurb')}
      </p>
      <div className="mt-8">
        <ButtonLink href="/">{t('nav.home')}</ButtonLink>
      </div>
    </div>
  );
}
