import { cn } from '@/lib/utils';

/**
 * The TriPyramids logomark, redrawn as a transparent inline SVG.
 *
 * This replaces the previous `/logo-icon.png` raster, which carried a baked-in
 * black plate and relied on `mix-blend-lighten` to hide it. That trick only
 * worked when the backdrop happened to be pure black — over the hero photo the
 * plate showed as a grey rectangle, and the blend washed out the artwork's
 * shadow tones. Being real vector geometry, this scales cleanly at any DPR and
 * sits on any background.
 *
 * Geometry mirrors the logo: a radiant Ra disk behind three pyramids (Khafre
 * left, Khufu center and tallest, Menkaure right), over the dune sweep. Colors
 * come from the `pharaoh` tokens in tailwind.config.ts.
 */

const GOLD_LIGHT = '#E8CA82';
const GOLD = '#C9A24B';
const GOLD_DARK = '#8A6A26';

type LogoMarkProps = {
  className?: string;
  /** Rendered when the mark stands alone without the adjacent wordmark. */
  title?: string;
};

export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 72 56"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        {/* Sun disk: brightest at the crown, cooling toward the horizon. */}
        <linearGradient id="tp-logo-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="70%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DARK} />
        </linearGradient>
        {/* Lit face — the side catching the sun. */}
        <linearGradient id="tp-logo-lit" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
        {/* Shadow face — keeps the mark reading as volume, not a flat triangle. */}
        <linearGradient id="tp-logo-shade" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DARK} />
        </linearGradient>
      </defs>

      {/* Ra disk with rays, sitting behind the skyline. */}
      <g>
        <circle cx="36" cy="26" r="12.5" fill="url(#tp-logo-sun)" />
        <g stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          {Array.from({ length: 9 }, (_, i) => {
            // Rays fan across the upper half only, so the base stays clean.
            const angle = (192 + i * (156 / 8)) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1={36 + Math.cos(angle) * 15}
                y1={26 + Math.sin(angle) * 15}
                x2={36 + Math.cos(angle) * 19}
                y2={26 + Math.sin(angle) * 19}
              />
            );
          })}
        </g>
      </g>

      {/* Khafre — mid-height, left. */}
      <g>
        <path d="M18 21 L18 44 L2 44 Z" fill="url(#tp-logo-lit)" />
        <path d="M18 21 L34 44 L18 44 Z" fill="url(#tp-logo-shade)" />
      </g>

      {/* Menkaure — smallest, right. */}
      <g>
        <path d="M55 25 L55 44 L41 44 Z" fill="url(#tp-logo-lit)" />
        <path d="M55 25 L70 44 L55 44 Z" fill="url(#tp-logo-shade)" />
      </g>

      {/* Khufu — tallest, center, overlapping the disk. */}
      <g>
        <path d="M36 9 L36 44 L17 44 Z" fill="url(#tp-logo-lit)" />
        <path d="M36 9 L55 44 L36 44 Z" fill="url(#tp-logo-shade)" />
      </g>

      {/* Dune sweep beneath the plateau — the logo's flowing base. Kept as two
          nested arcs rather than long loose strokes so it still reads as ground
          at 32px rather than dissolving into stray marks. */}
      <g fill="none" stroke={GOLD} strokeLinecap="round">
        <path d="M2 46.4c11-4.2 22-4.2 34 0s22 4.2 34 0" strokeWidth="2.4" />
        <path
          d="M9 51.2c9-3.2 18-3.2 27 0s18 3.2 27 0"
          strokeWidth="1.6"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
