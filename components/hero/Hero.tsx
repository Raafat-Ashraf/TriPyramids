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
 * (slowest), the animated pyramid scene, then the copy (fastest) — moving via
 * `transform` only. Photo credit: Unsplash (golden-hour Giza plateau).
 */
const PARALLAX_RANGE = 600;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // Under reduced motion, skip the entrance animations and render the copy at
  // its final, visible state — critical content never waits on an animation.
  const reveal = !prefersReduced;

  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.5,
  });

  // Photo is the slowest plane; scene drifts up slightly; copy moves most.
  const photoY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '12%']);
  const photoScale = useTransform(smooth, [0, PARALLAX_RANGE], [1, 1.08]);
  const sceneY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '-6%']);
  const copyY = useTransform(smooth, [0, PARALLAX_RANGE], ['0%', '26%']);

  const stats = [
    { key: 'destinations', value: 12, suffix: '+', decimals: 0 },
    { key: 'travelers', value: 500, suffix: '+', decimals: 0 },
    { key: 'years', value: 10, suffix: '', decimals: 0 },
  ] as const;

  return (
    <section
      ref={sectionRef}
      className="relative isolate h-dvh min-h-[600px] overflow-hidden bg-pharaoh-black"
    >
      {/* Plane 1 — the Egypt photograph, deepest and slowest */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={prefersReduced ? undefined : { y: photoY, scale: photoScale }}
        aria-hidden="true"
      >
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlays. Vertical: dark top for header/headline, opening
            over the sunset mid-frame, dark base to seat the scene. Directional
            scrim: darker on the copy side (left in LTR, right in RTL) so the
            headline, CTAs and stats stay legible while the sunset shows through
            on the far side. Plus a warm gold wash low. */}
        <div className="absolute inset-0 bg-gradient-to-b from-pharaoh-black/88 via-pharaoh-black/30 to-pharaoh-black/92" />
        <div className="absolute inset-0 from-pharaoh-black/85 via-pharaoh-black/25 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-pharaoh-goldDark/20 via-transparent to-transparent" />
      </motion.div>

      {/* Plane 2 — the animated pyramid scene, anchored to the bottom edge,
          spanning the full width, occupying the lower portion of the hero. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[54dvh] sm:h-[60dvh]"
        style={prefersReduced ? undefined : { y: sceneY }}
      >
        <PyramidScene className="size-full" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-pharaoh-black to-transparent"
        />
      </motion.div>

      {/* Plane 3 — copy, in the upper area, clear of the scene */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col pt-[var(--header-height)]"
        style={prefersReduced ? undefined : { y: copyY }}
      >
        <div className="shell pt-5 sm:pt-9">
          <div className="max-w-[88vw] text-start sm:max-w-2xl">
            <h1 className="font-display text-[1.7rem] font-extrabold leading-[1.12] text-pharaoh-cream drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl">
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
              className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Magnetic strength={10} className="w-full sm:w-auto">
                <ButtonLink href="/#trips" size="lg" className="w-full justify-center sm:w-auto">
                  {t('ctaPrimary')}
                  <ArrowUpRight className="size-5 rtl:-scale-x-100" aria-hidden="true" />
                </ButtonLink>
              </Magnetic>
              <Magnetic strength={8} className="w-full sm:w-auto">
                <ButtonLink href="/#reviews" size="lg" variant="onDark" className="w-full justify-center sm:w-auto">
                  {t('ctaSecondary')}
                </ButtonLink>
              </Magnetic>
            </motion.div>

            <motion.dl
              initial={reveal ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.56, ease: EASE }}
              className="mt-9 grid max-w-lg grid-cols-3 gap-x-4 border-t border-pharaoh-gold/20 pt-5 sm:mt-10 sm:gap-x-8"
            >
              {stats.map((stat) => (
                <div key={stat.key}>
                  <dd className="font-display text-2xl font-bold text-pharaoh-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-4xl">
                    <Counter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-pharaoh-cream/65 sm:text-xs">
                    {t(`stats.${stat.key}`)}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </motion.div>

      {/* Caption + progress strip, thin, at the base of the scene */}
      <motion.div
        initial={reveal ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1 }}
        className="absolute inset-x-0 bottom-16 z-20 hidden sm:block"
      >
        <div className="shell flex items-center gap-3">
          <span className="whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.22em] text-pharaoh-cream/60">
            {t('sceneCaption')}
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-pharaoh-gold/20">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-pharaoh-gold to-transparent bg-[length:200%_100%]" />
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((tick) => (
              <span key={tick} className="h-2 w-px bg-pharaoh-gold/40" />
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
        className="group absolute inset-x-0 bottom-5 z-20 mx-auto flex w-fit flex-col items-center gap-1.5
                   rounded-full px-4 py-2 text-pharaoh-cream/70 transition-colors hover:text-pharaoh-gold"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em]">
          {t('scrollHint')}
        </span>
        <ArrowDown className="size-4 animate-float transition-transform group-hover:translate-y-1" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
