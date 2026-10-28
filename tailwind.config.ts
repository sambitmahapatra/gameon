import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '3rem',
        xl: '6rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        // GameOn tokens (spec 3.1)
        deep: 'hsl(var(--bg-deep))',
        surface: 'hsl(var(--bg-surface))',
        elevated: 'hsl(var(--bg-elevated))',
        cyan: {
          DEFAULT: 'hsl(var(--accent-primary))',
          foreground: 'hsl(var(--bg-deep))',
        },
        ember: {
          DEFAULT: 'hsl(var(--accent-warm))',
          foreground: 'hsl(var(--bg-deep))',
        },
        // shadcn/ui bridge
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Spec 3.2 type scale
        hero: [
          'clamp(2.75rem, 7vw, 4.5rem)',
          { lineHeight: '1.05', letterSpacing: '-0.03em' },
        ],
        h1: ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: [
          'clamp(1.625rem, 3vw, 2rem)',
          { lineHeight: '1.2', letterSpacing: '-0.015em' },
        ],
        h3: ['1.5rem', { lineHeight: '1.3' }],
        body: ['1rem', { lineHeight: '1.6' }],
        meta: ['0.875rem', { lineHeight: '1.5' }],
        data: ['0.9375rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        // Spec 3.3 — deliberately not uniform
        button: '8px',
        card: '12px',
        modal: '24px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        18: '4.5rem',
        13: '3.25rem',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        glow: '0 0 0 1px hsl(var(--accent-primary) / 0.4), 0 8px 40px -12px hsl(var(--accent-primary) / 0.45)',
        'glow-warm':
          '0 0 0 1px hsl(var(--accent-warm) / 0.4), 0 8px 40px -12px hsl(var(--accent-warm) / 0.4)',
        panel: '0 24px 60px -30px rgb(0 0 0 / 0.8)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, hsl(var(--border-subtle)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border-subtle)) 1px, transparent 1px)',
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
        'slot-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--accent-primary) / 0.5)' },
          '50%': { boxShadow: '0 0 0 6px hsl(var(--accent-primary) / 0)' },
        },
        'drift-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slot-pulse': 'slot-pulse 1.8s ease-out infinite',
        'drift-y': 'drift-y 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
