import { cn } from '@/lib/utils';

/**
 * The logo's hieroglyph accent set, redrawn as thin gold-line SVGs.
 *
 * These are the recurring divider/accent motif across the site (Eye of Horus,
 * cartouche, Horus falcon, ankh, sun disk). All use `currentColor` so a parent
 * sets the gold; keep them simple line-art, not literal glyph geometry.
 */

type GlyphProps = { className?: string; size?: number };

function svgProps(size: number) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
}

/** Eye of Horus (Wedjat). */
export function EyeOfHorus({ className, size = 24 }: GlyphProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <path d="M3 9c3-2.6 8-3 12-1.2 2 .9 3.4 2 4.8 3.4" />
      <path d="M3.6 11.3c2.6 2.4 6.4 3.2 10 2 2-.7 3.4-2 4.4-3.9" />
      <circle cx="9.5" cy="10.4" r="1.7" fill="currentColor" stroke="none" />
      <path d="M8.4 13.2 6.8 18" />
      <path d="M12.6 13.4c.7 2.4 2.4 3.6 4.6 3.4 1.6-.2 2-1.6 1.1-2.7" />
    </svg>
  );
}

/** Royal cartouche — an oval rope loop with a base bar. */
export function Cartouche({ className, size = 24 }: GlyphProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <rect x="8" y="3" width="8" height="16" rx="4" />
      <path d="M8 18.5h8" />
      <path d="M11 7.5v7M13 7.5v7" />
    </svg>
  );
}

/** Horus falcon, in profile. */
export function Falcon({ className, size = 24 }: GlyphProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <path d="M5 6.5c1.8-.6 3.4-.2 4.6 1.1" />
      <path d="M3.5 7.6 5 6.4" />
      <path d="M9.6 7.6c2.2 1 4.6 1.4 7 1-1.2 2.1-3 3.4-5.2 3.8" />
      <path d="M11.4 12.4c1.8 1.4 2.8 3.4 3 6" />
      <path d="M9.6 11.8c-1.2 2-3 3.2-5.4 3.6 1.6-1.8 2.4-3.6 2.6-5.6" />
      <path d="M14.6 8.8c1.6.2 3 .9 4.2 2" />
    </svg>
  );
}

/** Ankh — the key of life. */
export function Ankh({ className, size = 24 }: GlyphProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <ellipse cx="12" cy="6.5" rx="3.2" ry="4" />
      <path d="M12 10.5V21" />
      <path d="M6.5 13.5h11" />
    </svg>
  );
}

/** A radiant sun disk (Ra) with rays — the logo's crowning mark. */
export function SunDisk({ className, size = 24 }: GlyphProps) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = 12 + Math.cos(angle) * 7.5;
    const y1 = 12 + Math.sin(angle) * 7.5;
    const x2 = 12 + Math.cos(angle) * 10.5;
    const y2 = 12 + Math.sin(angle) * 10.5;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <svg {...svgProps(size)} className={className}>
      <circle cx="12" cy="12" r="5.2" />
      {rays}
    </svg>
  );
}

/**
 * The section divider from the logo: a thin gold rule broken in the center by
 * three glyphs (Eye of Horus · cartouche · falcon).
 */
export function GlyphDivider({
  className,
  glyphClassName,
}: {
  className?: string;
  glyphClassName?: string;
}) {
  return (
    <div
      className={cn('flex items-center justify-center gap-4', className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-pharaoh-gold/50 sm:w-28" />
      <span className={cn('flex items-center gap-3 text-pharaoh-gold', glyphClassName)}>
        <EyeOfHorus size={22} />
        <Cartouche size={20} />
        <Falcon size={22} />
      </span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-pharaoh-gold/50 sm:w-28" />
    </div>
  );
}
