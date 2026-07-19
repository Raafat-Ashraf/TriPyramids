'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';

/**
 * The hero foreground scene: the three Giza pyramids as dark, gold-edged
 * silhouettes rising over the Nile, sat against the photographic golden-hour sky
 * behind them.
 *
 * Architecture (unchanged from the reference approach):
 *  1. The markup *is* the finished plateau. Every BUILD tween is a `.from()`, so
 *     the resting state is three complete pyramids + a calm Nile. No-JS, failed
 *     hydration and reduced-motion all land on the finished scene.
 *  2. Only transform (x/y/scale/rotate), opacity and fill animate — never a
 *     layout property — so it stays GPU-composited.
 *  3. Ambient loops (Nile shimmer, drifting feluccas, palm sway) are created as
 *     SEPARATE one-off tweens, never inside the repeating build timeline, so
 *     they can't stack/leak on each repeat.
 *
 * Every colour is a JS constant here, mirroring the pharaoh.* tokens.
 */

// ── Palette (mirrors tailwind pharaoh.* tokens) ─────────────
const BLACK = '#0A0A0A';
const GOLD = '#C9A24B';
const GOLD_LIGHT = '#E8CA82';
const GOLD_DARK = '#8A6A26';
const CREAM = '#F0E6CC';

// ── Scene geometry (viewBox units) ──────────────────────────
const VW = 1600;
const VH = 640;
const FAR_GROUND = 472; // far shore where the pyramids stand
const WATER_TOP = 480;
const WATER_BOT = 566;

/** Build playback speed (applied via timeScale, so choreography keeps shape). */
const BUILD_SPEED = 1.35;

/** Tiny deterministic PRNG so block jitter matches on server and client. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface BlockData {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number; // ramp-slide start offset
  dy: number;
  delay: number; // per-block stagger (bottom-first + jitter)
  key: string;
}

interface PyramidConfig {
  prefix: string;
  cx: number;
  baseY: number;
  halfWidth: number;
  height: number;
  courses: number;
  seed: number;
}

/** Lay a pyramid as receding, hand-jittered masonry courses. */
function makeBlocks(cfg: PyramidConfig) {
  const { cx, baseY, halfWidth, height, courses, seed } = cfg;
  const apexY = baseY - height;
  const wAt = (y: number) => (halfWidth * (y - apexY)) / height;
  const rnd = seeded(seed);
  const courseH = height / courses;
  const blocks: BlockData[] = [];

  for (let i = 0; i < courses; i += 1) {
    const yb = baseY - i * courseH;
    const yt = yb - courseH;
    const wB = wAt(yb);
    // Block count scales with course width; wider blocks lower down.
    const n = Math.max(1, Math.round((wB * 2) / 92));
    const left = cx - wB;
    const span = (wB * 2) / n;

    for (let j = 0; j < n; j += 1) {
      const jitterX = (rnd() - 0.5) * 9;
      const topJitter = (rnd() - 0.5) * 7;
      const x = left + j * span + jitterX * 0.35;
      const w = span + 1.6; // slight overlap kills seams
      const y = yt + topJitter;
      const h = yb - y + 1.6;
      blocks.push({
        x,
        y,
        w,
        h,
        dx: 10 + rnd() * 16, // arrives from down-right, up the ramp
        dy: 20 + rnd() * 22,
        delay: i * 0.11 + rnd() * 0.05,
        key: `${seed}-${i}-${j}`,
      });
    }
  }

  return { blocks, apexY, wAt };
}

function Pyramid(cfg: PyramidConfig) {
  const { prefix, cx, baseY, halfWidth, height } = cfg;
  const { blocks, apexY, wAt } = useMemo(() => makeBlocks(cfg), [cfg]);

  const capH = Math.min(26, height * 0.07);
  const capBaseY = apexY + capH;
  const capW = wAt(capBaseY);

  // Ramp up the right (shadow) flank.
  const rampTopY = baseY - height * 0.52;
  const rampTopX = cx + wAt(rampTopY);

  return (
    <g className={prefix}>
      {/* Capstone glow — blooms as the pyramidion lands */}
      <ellipse
        className="cap-glow"
        cx={cx}
        cy={apexY + capH * 0.3}
        rx={capW * 3.4}
        ry={capH * 2.6}
        fill="url(#tp-cap-glow)"
      />

      {/* Masonry */}
      {blocks.map((b) => (
        <rect
          key={b.key}
          className="blk"
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill="url(#tp-stone)"
          stroke={GOLD_DARK}
          strokeOpacity={0.14}
          strokeWidth={0.5}
          data-dx={b.dx}
          data-dy={b.dy}
          data-delay={b.delay}
        />
      ))}

      {/* Warm sheen on the lit (left) face */}
      <path
        className="face"
        d={`M ${cx - halfWidth} ${baseY} L ${cx} ${apexY} L ${cx} ${baseY} Z`}
        fill="url(#tp-face)"
        opacity={0.55}
      />

      {/* Gold rim light on the sunward edge */}
      <path
        className="ridge"
        d={`M ${cx - halfWidth} ${baseY} L ${cx} ${apexY}`}
        fill="none"
        stroke="url(#tp-ridge)"
        strokeWidth={1.8}
        strokeOpacity={0.85}
        strokeLinecap="round"
        filter="url(#tp-glow)"
      />

      {/* Construction ramp (transient; default hidden) */}
      <g className="ramp" style={{ opacity: 0 }}>
        <path
          d={`M ${cx + halfWidth * 1.16} ${baseY} L ${rampTopX + 6} ${rampTopY} L ${rampTopX - 10} ${rampTopY} L ${cx + halfWidth * 0.98} ${baseY} Z`}
          fill={GOLD_DARK}
          fillOpacity={0.7}
        />
        <line
          x1={cx + halfWidth * 1.07}
          y1={baseY - 2}
          x2={rampTopX - 2}
          y2={rampTopY + 2}
          stroke={CREAM}
          strokeOpacity={0.35}
          strokeWidth={1}
        />
      </g>

      {/* Pyramidion */}
      <g className="cap">
        <path
          d={`M ${cx - capW} ${capBaseY} L ${cx} ${apexY} L ${cx + capW} ${capBaseY} Z`}
          fill={BLACK}
          stroke="url(#tp-ridge)"
          strokeWidth={1.6}
        />
      </g>
    </g>
  );
}

export function PyramidScene({ className }: { className?: string }) {
  const t = useTranslations('hero');
  const rootRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    // The markup already is the finished scene — leave it be under reduced motion.
    if (prefersReduced) return;

    let observer: IntersectionObserver | undefined;

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 640px)').matches;

      // ── Ambient loops (created once, outside the build loop) ──
      gsap.to('.nile-glint', {
        opacity: '-=0.35',
        scaleX: 1.25,
        transformOrigin: 'center center',
        duration: 2.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.35, from: 'center' },
      });
      gsap.to('.palm-crown', {
        rotation: 3,
        transformOrigin: 'bottom center',
        duration: 3.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.6,
      });
      // Feluccas drift the full width and wrap around.
      gsap.utils.toArray<SVGGElement>('.felucca').forEach((boat, index) => {
        gsap.fromTo(
          boat,
          { x: index === 0 ? 0 : -520 },
          {
            x: index === 0 ? 1250 : 1780,
            duration: index === 0 ? 34 : 46,
            ease: 'none',
            repeat: -1,
          },
        );
      });

      // ── The build timeline ───────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.35,
        repeat: -1,
        repeatDelay: 3,
      });
      tl.timeScale(BUILD_SPEED * (isMobile ? 1.3 : 1));

      // Horizon sun glow + far shore wipe in
      tl.from('.scene-sun', {
        opacity: 0,
        scale: 0.6,
        transformOrigin: '50% 80%',
        duration: 1,
        ease: 'power2.out',
      })
        .from(
          '.far-shore',
          { scaleX: 0, transformOrigin: 'center center', duration: 0.7 },
          '-=0.5',
        )
        .from(
          '.back-palm',
          { opacity: 0, scaleY: 0, transformOrigin: 'bottom center', duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' },
          '-=0.3',
        );

      tl.addLabel('build');

      // Each pyramid: blocks slide up the ramp course-by-course with jittered
      // timing, the ramp fades through the build, then the face sheen, ridge and
      // capstone finish it — Khufu (centre) starts last so it tops out last.
      const buildPyramid = (prefix: string, at: string) => {
        tl.from(
          `.${prefix} .blk`,
          {
            opacity: 0,
            x: (_i: number, el: Element) =>
              Number((el as SVGElement).getAttribute('data-dx')),
            y: (_i: number, el: Element) =>
              Number((el as SVGElement).getAttribute('data-dy')),
            duration: 0.5,
            ease: 'power2.out',
            stagger: (_i: number, el: Element) =>
              Number((el as SVGElement).getAttribute('data-delay')),
          },
          at,
        )
          .to(`.${prefix} .ramp`, { opacity: 0.85, duration: 0.4 }, at)
          .to(`.${prefix} .ramp`, { opacity: 0, duration: 0.7 }, '>-0.1')
          .from(`.${prefix} .face`, { opacity: 0, duration: 0.6 }, '-=0.5')
          .from(`.${prefix} .ridge`, { opacity: 0, duration: 0.6 }, '<')
          .from(
            `.${prefix} .cap`,
            { y: -46, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' },
            '-=0.35',
          )
          .from(
            `.${prefix} .cap-glow`,
            { opacity: 0, scale: 0.3, transformOrigin: '50% 60%', duration: 0.6 },
            '-=0.3',
          );
      };

      buildPyramid('khafre', 'build'); // back-right, starts first
      buildPyramid('menkaure', 'build+=0.5'); // front-left, small
      buildPyramid('khufu', 'build+=1.05'); // centre, largest, finishes last

      // Nile + feluccas + foreground palms settle last
      tl.from(
        '.nile',
        { scaleX: 0, transformOrigin: 'center center', duration: 0.8, ease: 'power2.inOut' },
        'build+=2.4',
      )
        .from('.nile-glint', { opacity: 0, duration: 0.6 }, '-=0.4')
        .from(
          '.felucca',
          { opacity: 0, y: 10, duration: 0.6, stagger: 0.2, ease: 'back.out(1.6)' },
          '-=0.3',
        )
        .from(
          '.fore-palm',
          { opacity: 0, scaleY: 0, transformOrigin: 'bottom center', duration: 0.6, stagger: 0.12, ease: 'back.out(1.8)' },
          '-=0.5',
        );

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) tl.play();
          else tl.pause();
        },
        { threshold: 0 },
      );
      observer.observe(root);
    }, root);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      viewBox={`0 0 ${VW} ${VH}`}
      className={className}
      role="img"
      aria-label={t('sceneLabel')}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="tp-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171009" />
          <stop offset="100%" stopColor={BLACK} />
        </linearGradient>
        <linearGradient id="tp-face" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.5" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.16" />
          <stop offset="100%" stopColor={GOLD_DARK} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tp-ridge" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_LIGHT} />
        </linearGradient>
        <radialGradient id="tp-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.8" />
          <stop offset="35%" stopColor={GOLD} stopOpacity="0.4" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tp-cap-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.9" />
          <stop offset="100%" stopColor={GOLD_LIGHT} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tp-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241a0d" />
          <stop offset="18%" stopColor="#120d07" />
          <stop offset="100%" stopColor={BLACK} />
        </linearGradient>
        <filter id="tp-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Horizon sun glow, low behind the pyramids ── */}
      <circle
        className="scene-sun"
        cx={780}
        cy={FAR_GROUND - 26}
        r={230}
        fill="url(#tp-sun-glow)"
      />

      {/* ── Far shore line ── */}
      <rect
        className="far-shore"
        x="0"
        y={FAR_GROUND}
        width={VW}
        height={WATER_TOP - FAR_GROUND + 2}
        fill="#0d0a06"
      />

      {/* ── Palms on the far bank (behind pyramids) ── */}
      <Palm className="back-palm" x={150} y={FAR_GROUND + 2} scale={0.7} flip />
      <Palm className="back-palm" x={1470} y={FAR_GROUND + 2} scale={0.75} />

      {/* ── The three pyramids (back → front) ── */}
      <Pyramid prefix="khafre" cx={1076} baseY={FAR_GROUND - 6} halfWidth={252} height={384} courses={14} seed={41} />
      <Pyramid prefix="menkaure" cx={432} baseY={FAR_GROUND + 2} halfWidth={150} height={206} courses={9} seed={7} />
      <Pyramid prefix="khufu" cx={742} baseY={FAR_GROUND} halfWidth={300} height={408} courses={15} seed={19} />

      {/* ── The Nile ── */}
      <g>
        <rect
          className="nile"
          x="0"
          y={WATER_TOP}
          width={VW}
          height={WATER_BOT - WATER_TOP}
          fill="url(#tp-water)"
        />
        {/* Sun reflection: gold glints shimmering under the sun */}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = WATER_TOP + 8 + i * ((WATER_BOT - WATER_TOP - 10) / 6);
          const w = 150 - i * 12;
          return (
            <ellipse
              key={`glint-${i}`}
              className="nile-glint"
              cx={780}
              cy={y}
              rx={w}
              ry={1.6}
              fill={GOLD}
              opacity={0.5 - i * 0.03}
            />
          );
        })}
        {/* Far-water highlight line */}
        <rect x="0" y={WATER_TOP} width={VW} height="1.5" fill={GOLD} opacity="0.35" />
      </g>

      {/* Feluccas drifting on the water */}
      <Felucca className="felucca" x={430} y={WATER_TOP + 30} scale={1} />
      <Felucca className="felucca" x={980} y={WATER_TOP + 52} scale={0.72} />

      {/* ── Near foreground bank ── */}
      <rect x="0" y={WATER_BOT} width={VW} height={VH - WATER_BOT} fill={BLACK} />
      <Palm className="fore-palm" x={96} y={VH - 6} scale={1.15} />
      <Palm className="fore-palm" x={1520} y={VH - 6} scale={1.25} flip />
      <Palm className="fore-palm" x={1380} y={VH + 4} scale={0.95} flip />
    </svg>
  );
}

/** Gold-outlined felucca (hull + lateen sail). */
function Felucca({
  className,
  x,
  y,
  scale,
}: {
  className?: string;
  x: number;
  y: number;
  scale: number;
}) {
  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill="none" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {/* Hull */}
        <path d="M-34 0 Q0 12 34 0 L26 5 Q0 9 -26 5 Z" fill={BLACK} fillOpacity={0.85} />
        {/* Mast */}
        <line x1="0" y1="0" x2="0" y2="-46" />
        {/* Lateen sail */}
        <path d="M0 -44 L28 -6 L0 -6 Z" fill={GOLD} fillOpacity={0.14} />
        <path d="M0 -40 L-18 -6 L0 -6 Z" fill={GOLD} fillOpacity={0.08} />
      </g>
    </g>
  );
}

/** Dark palm silhouette with a faint gold rim; crown sways on a loop. */
function Palm({
  className,
  x,
  y,
  scale,
  flip = false,
}: {
  className?: string;
  x: number;
  y: number;
  scale: number;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -scale : scale)} ${scale})`}>
      <g className={className}>
        {/* Trunk */}
        <path
          d="M0 0 C-3 -26 -2 -48 3 -74"
          fill="none"
          stroke="#0d0a06"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Crown fronds */}
        <g className="palm-crown" transform="translate(3 -74)" fill="none" stroke="#0d0a06" strokeWidth={3.4} strokeLinecap="round">
          <path d="M0 0 C-14 -8 -26 -6 -34 2" />
          <path d="M0 0 C-10 -16 -20 -22 -30 -22" />
          <path d="M0 0 C2 -18 0 -30 -6 -40" />
          <path d="M0 0 C12 -16 22 -20 32 -18" />
          <path d="M0 0 C16 -6 28 -2 36 6" />
          <path d="M0 0 C10 2 20 8 26 18" />
          {/* faint gold rim on a couple of fronds */}
          <path d="M0 0 C-10 -16 -20 -22 -30 -22" stroke={GOLD} strokeOpacity={0.3} strokeWidth={1} />
          <path d="M0 0 C12 -16 22 -20 32 -18" stroke={GOLD} strokeOpacity={0.3} strokeWidth={1} />
        </g>
      </g>
    </g>
  );
}
