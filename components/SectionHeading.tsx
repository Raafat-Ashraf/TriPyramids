import { cn } from '@/lib/utils';
import { GlyphDivider } from './Glyphs';

/**
 * The shared section header: a gold eyebrow, a serif title, an optional
 * subtitle, and the hieroglyph divider — the recurring rhythm between sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  divider = true,
  tone = 'dark',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  divider?: boolean;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      {divider && <GlyphDivider />}
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
            tone === 'dark' ? 'text-pharaoh-cream/65' : 'text-pharaoh-black/60',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
