'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

import { ButtonLink } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { Counter } from '@/components/ui/Counter';
import { PyramidScene } from './PyramidScene';

/**
 * Homepage hero.
 *
 * Three depth planes drift at different rates on scroll — the Egypt photograph
 * (deepest/slowest), the animated pyramid scene, then the copy (fastest) —
 * moving via `transform` only.
 *
 * Stacking order is deliberate: photo (-z-20) → one light overlay (inside it) →
 * pyramid scene (z-[5], so it sits ABOVE the overlay and reads against the
 * photo) → copy (z-10) with a scrim scoped to just the copy column → caption
 * and scroll hint (z-20). Nothing full-bleed is heavy enough to bury the scene.
 *
 * Photo: golden-hour Giza plateau (Unsplash), served via next/image.
 */
const PARALLAX_RANGE = 600;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const reveal = !prefersReduced;

  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.5,
  });

  const photoY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '12%']);
  const photoScale = useTransform(smooth, [0, PARALLAX_RANGE], [1, 1.08]);
  const sceneY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '-6%']);
  const copyY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '22%']);

  const stats = [
    { key: 'destinations', value: 12, suffix: '+', decimals: 0 },
    { key: 'travelers', value: 500, suffix: '+', decimals: 0 },
    { key: 'years', value: 10, suffix: '', decimals: 0 },
  ] as const;

  return (
    <section
      ref={sectionRef}
      aria-label={t('sceneCaption')}
      className="relative isolate h-[100svh] min-h-[600px] w-full overflow-hidden bg-pharaoh-black"
    >
      {/* Plane 1 — the Egypt photograph (deepest, slowest). One light overlay:
          a touch dark at the top for the header/headline, clear through the
          middle so the golden hour reads, a soft base fade to seat the scene. */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={prefersReduced ? undefined : { y: photoY, scale: photoScale }}
        aria-hidden="true"
      >
        {/* Art direction by breakpoint. The landscape source can't survive a
            portrait crop — `object-cover` on a phone throws away the plateau and
            lands on foreground trees. So phones get a genuinely portrait 2:3
            frame of the same scene (Khafre, Menkaure and the Sphinx), and wide
            screens keep the full vista. */}
        <Image
          src="/hero-giza-mobile.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-[center_35%] sm:hidden"
        />
        <Image
          src="/hero-giza.jpg"
          alt=""
          fill
          priority
          quality={80}
          sizes="100vw"
          className="hidden object-cover object-[center_38%] sm:block"
        />
        {/* The photograph is already a dark black-and-gold frame, so this only
            needs to seat the header and the scene — not rescue contrast. Keeping
            it light preserves the sunset. */}
        <div className="absolute inset-0 bg-gradient-to-b from-pharaoh-black/55 via-transparent to-pharaoh-black/40 sm:from-pharaoh-black/45 sm:to-pharaoh-black/30" />
      </motion.div>

      {/* Plane 2 — the animated pyramid scene, above the overlay so it reads
          clearly against the photo. Lower ~45% of the hero, full width. */}
      <motion.div
        /* Shorter on mobile: the scene is a 2.5:1 letterboxed SVG, so a tall
           box on a narrow screen wasted vertical space and pushed the copy into
           the header. */
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[32svh] sm:h-[46svh]"
        style={prefersReduced ? undefined : { y: sceneY }}
        aria-hidden="true"
      >
        <PyramidScene className="size-full" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-pharaoh-black/80 to-transparent" />
      </motion.div>

      {/* Plane 3 — copy, vertically centered in the space above the scene. */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col justify-center pt-[calc(var(--header-height)+1rem)] pb-[32svh] sm:pt-[var(--header-height)] sm:pb-[46svh]"
        style={prefersReduced ? undefined : { y: copyY }}
      >
        <div className="shell">
          <div className="relative w-full max-w-2xl text-start">
            {/* Scrim scoped to the copy column (not full-bleed) — a soft dark
                spotlight so the headline/CTAs/stats stay legible over any part
                of the photo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-[1] rounded-[3rem] bg-pharaoh-black/40 blur-2xl sm:-inset-x-10 sm:-inset-y-12 sm:bg-pharaoh-black/28 sm:blur-3xl"
            />

            <h1 className="font-display text-[1.75rem] font-extrabold leading-[1.12] text-pharaoh-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl">
              {[t('titleLine1'), t('titleLine2')].map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    initial={reveal ? { y: '110%' } : false}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.95, delay: 0.12 + index * 0.12, ease: EASE }}
                  >
                    {index === 1 ? (
                      <span className="text-gold-gradient">{line}</span>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={reveal ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
              className="mt-6 flex"
            >
              <Magnetic strength={10} className="w-full sm:w-auto">
                <ButtonLink href="/#trips" size="lg" className="w-full justify-center sm:w-auto">
                  {t('ctaPrimary')}
                  <ArrowUpRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                </ButtonLink>
              </Magnetic>
            </motion.div>

            <motion.dl
              initial={reveal ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.56, ease: EASE }}
              className="mt-6 grid max-w-md grid-cols-3 gap-x-3 border-t border-pharaoh-gold/25 pt-4 sm:mt-8 sm:gap-x-6 sm:pt-5"
            >
              {stats.map((stat) => (
                <div key={stat.key} className="min-w-0">
                  <dd className="font-display text-2xl font-bold text-pharaoh-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-4xl">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-pharaoh-cream/80 sm:text-xs">
                    {t(`stats.${stat.key}`)}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </motion.div>

      {/* Caption + progress strip — thin, aligned to the content container, sat
          low over the scene's dark base (clear of the stat row above). */}
      <motion.div
        initial={reveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1 }}
        className="absolute inset-x-0 bottom-14 z-20 hidden sm:block"
      >
        <div className="shell flex items-center gap-3">
          <span className="whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.22em] text-pharaoh-cream/70">
            {t('sceneCaption')}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-pharaoh-gold/25">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-pharaoh-gold to-transparent bg-[length:200%_100%]" />
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((tick) => (
              <span key={tick} className="h-2 w-px bg-pharaoh-gold/45" />
            ))}
          </span>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.a
        href="#trips"
        initial={reveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        aria-label={t('scrollHint')}
        className="group absolute inset-x-0 bottom-4 z-20 mx-auto flex w-fit flex-col items-center gap-1.5
                   rounded-full px-4 py-2 text-pharaoh-cream/75 transition-colors hover:text-pharaoh-gold
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em]">
          {t('scrollHint')}
        </span>
        <ArrowDown className="size-4 animate-float transition-transform group-hover:translate-y-1" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
