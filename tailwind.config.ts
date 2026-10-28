import type { Config } from 'tailwindcss';

/**
 * Colours resolve to the V3 tokens in src/app/globals.css. Each token is a
 * space-separated RGB channel triple, so `/opacity` modifiers keep working
 * (`bg-brand/20`). `brand` is the design's accent — cyan in dark, blue in
 * light — while shadcn's own `accent` stays a quiet surface, since its
 * primitives use it for hover and highlight states.
 */
const config: Config = {
  // next-themes writes data-theme; the reference design keys dark off it
  darkMode: ['selector', ':root[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // GameOn V3 palette
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)',
          2: 'rgb(var(--surface-2-rgb) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--fg-rgb) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted-rgb) / <alpha-value>)',
          dim: 'rgb(var(--fg-dim-rgb) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--border-rgb) / <alpha-value>)',
          strong: 'rgb(var(--border-strong-rgb) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          foreground: 'rgb(var(--bg-rgb) / <alpha-value>)',
        },
        magenta: 'rgb(var(--magenta-rgb) / <alpha-value>)',
        amber: 'rgb(var(--amber-rgb) / <alpha-value>)',
        violet: 'rgb(var(--violet-rgb) / <alpha-value>)',
        green: 'rgb(var(--green-rgb) / <alpha-value>)',

        // shadcn/ui bridge
        border: 'rgb(var(--border-rgb) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--ui-accent) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card-bg) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover-bg) / <alpha-value>)',
          foreground: 'rgb(var(--foreground) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // V3 scale (globals.css styles h1–h4 directly; these are for spans)
        hero: [
          'clamp(2.5rem, 7vw, 5.5rem)',
          { lineHeight: '0.98', letterSpacing: '-0.035em' },
        ],
        h1: [
          'clamp(2.5rem, 7vw, 5.5rem)',
          { lineHeight: '0.98', letterSpacing: '-0.035em' },
        ],
        h2: [
          'clamp(2rem, 4.5vw, 3.5rem)',
          { lineHeight: '1.02', letterSpacing: '-0.025em' },
        ],
        h3: [
          'clamp(1.25rem, 2vw, 1.5rem)',
          { lineHeight: '1.15', letterSpacing: '-0.025em' },
        ],
        body: ['1rem', { lineHeight: '1.55' }],
        meta: ['0.9rem', { lineHeight: '1.5' }],
        data: ['0.86rem', { lineHeight: '1.45' }],
        micro: ['11px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        button: '10px',
        card: '18px',
        modal: '20px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      maxWidth: {
        prose: '68ch',
        shell: '1360px',
      },
      boxShadow: {
        card: 'var(--card-shadow)',
        'card-hover': 'var(--card-shadow-hover)',
        glow: '0 0 0 4px var(--accent-glow), 0 12px 24px -8px var(--accent-glow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '70%, 100%': { transform: 'scale(3.5)', opacity: '0' },
        },
        ripple: {
          to: { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-dot': 'pulse-dot 2.4s cubic-bezier(0, 0.4, 0.6, 1) infinite',
        ripple: 'ripple 0.6s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
