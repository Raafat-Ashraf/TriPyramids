import { cn } from '@/lib/utils';
import { SunDisk } from './Glyphs';

/**
 * The shared section header: a single centered gold glyph, an eyebrow, a serif
 * title, and an optional subtitle. The full hieroglyph trio is reserved for the
 * footer and major breaks — a lone glyph here keeps the motif from becoming
 * visual noise when it repeats above every section.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  tone = 'dark',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        centered ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      <SunDisk size={30} className="text-pharaoh-gold" aria-hidden="true" />
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-pharaoh-gold">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'font-display text-3xl font-bold leading-tight sm:text-4xl',
          tone === 'dark' ? 'text-pharaoh-cream' : 'text-pharaoh-black',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base leading-relaxed',
            tone === 'dark' ? 'text-pharaoh-cream/80' : 'text-pharaoh-black/70',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
