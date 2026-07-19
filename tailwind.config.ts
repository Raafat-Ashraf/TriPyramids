import type { Config } from 'tailwindcss';

/**
 * TriPyramids theme.
 *
 * The palette is lifted straight from the logo: warm Egyptian gold on deep
 * black. Every brand surface uses these tokens instead of arbitrary hex values
 * so the site can't drift from the mark. The hero's SVG scene mirrors these
 * exact values as JS constants (see components/hero/PyramidScene.tsx).
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pharaoh: {
          black: '#0A0A0A', // primary dark background (header, footer, dashboard)
          gold: '#C9A24B', // primary brand gold (buttons, links, active states)
          goldLight: '#E8CA82', // lighter gold for highlights/gradients/hover
          goldDark: '#8A6A26', // deep bronze gold for shadows/borders/pressed
          cream: '#F0E6CC', // off-white text on dark backgrounds (the wordmark)
          sand: '#E4C99A', // lighter warm tone for light section backgrounds
        },
      },
      fontFamily: {
        // Bound to next/font CSS variables set on <html> per locale.
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 18px 44px -18px rgba(201, 162, 75, 0.55)',
        'gold-lg': '0 24px 60px -20px rgba(201, 162, 75, 0.6)',
        lift: '0 20px 50px -24px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gold-gradient':
          'linear-gradient(120deg, #E8CA82 0%, #C9A24B 48%, #8A6A26 100%)',
        'sky-pharaoh':
          'radial-gradient(120% 90% at 50% 100%, rgba(201,162,75,0.22) 0%, rgba(138,106,38,0.10) 30%, rgba(10,10,10,0) 62%), linear-gradient(180deg, #050505 0%, #0A0A0A 45%, #140F06 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 2.4s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
