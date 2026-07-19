import { forwardRef } from 'react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'onDark' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'whitespace-nowrap overflow-hidden transition-all duration-300 gpu ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pharaoh-gold focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-pharaoh-black disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';

const variants: Record<Variant, string> = {
  // Solid brand gold, black text. Brightens + glows on hover, presses on active.
  primary:
    'bg-gold-gradient text-pharaoh-black shadow-gold ' +
    'hover:-translate-y-0.5 hover:shadow-gold-lg hover:brightness-[1.08] ' +
    'active:translate-y-0 active:scale-[0.98] active:brightness-100',
  // Secondary: transparent with a gold border, fills faintly on hover. A dark
  // backing keeps it legible on bright photo areas.
  onDark:
    'border border-pharaoh-gold/55 bg-pharaoh-black/40 text-pharaoh-cream backdrop-blur-md ' +
    'hover:border-pharaoh-gold hover:bg-pharaoh-gold/15 hover:-translate-y-0.5 hover:text-white ' +
    'active:translate-y-0 active:scale-[0.98]',
  // Gold outline for use on light sand sections.
  outline:
    'border border-pharaoh-goldDark/45 bg-transparent text-pharaoh-goldDark ' +
    'hover:border-pharaoh-gold hover:bg-pharaoh-gold/10 hover:-translate-y-0.5 ' +
    'active:translate-y-0 active:scale-[0.98]',
  ghost: 'bg-transparent text-pharaoh-cream hover:bg-pharaoh-gold/10 active:scale-[0.98]',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-[0.9375rem]',
  lg: 'h-14 px-9 text-base',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>;

type AnchorProps = BaseProps & {
  href: string;
  external?: boolean;
} & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    // `popover` is dropped because React 19's DOM types widen it with "hint",
    // which next-intl's <Link> props (on the narrower union) reject.
    'className' | 'children' | 'href' | 'popover'
  >;

/** A gold sheen that sweeps across on hover. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
    >
      <span
        className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r
                   from-transparent via-white/30 to-transparent opacity-0 transition-all
                   duration-700 group-hover/btn:left-full group-hover/btn:opacity-100"
      />
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
});

export const ButtonLink = forwardRef<HTMLAnchorElement, AnchorProps>(
  function ButtonLink(
    { variant = 'primary', size = 'md', className, children, href, external, ...props },
    ref,
  ) {
    const classes = cn(base, variants[variant], sizes[size], className);
    const content = (
      <>
        <Sheen />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </>
    );

    if (external) {
      return (
        <a ref={ref} href={href} className={classes} {...props}>
          {content}
        </a>
      );
    }

    return (
      <Link ref={ref} href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  },
);
