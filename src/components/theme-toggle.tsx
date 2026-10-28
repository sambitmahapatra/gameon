'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/**
 * Sun in dark mode, moon in light. Both icons stay mounted and crossfade while
 * rotating, so the swap reads as one movement rather than a flicker.
 *
 * The server cannot know the stored preference, so it renders the moon — the
 * light default on a bare :root. That way the button is never blank, which is
 * what both icons at opacity 0 would have given us.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={
        mounted
          ? dark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      className={cn('theme-toggle', className)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        style={{
          opacity: mounted && dark ? 1 : 0,
          transform:
            mounted && dark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.6)',
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        style={{
          opacity: !mounted || !dark ? 1 : 0,
          transform:
            !mounted || !dark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.6)',
        }}
      >
        <path
          d="M20 14.5A8 8 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
