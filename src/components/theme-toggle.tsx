'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Sun in dark mode, moon in light. Both icons are mounted and crossfade while
 * rotating 180°, so the swap reads as one movement rather than a flicker.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server has no way to know the stored preference, so render the shell
  // first and let the icons appear once the theme is resolved.
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
          : 'Switch theme'
      }
      className={cn(
        'relative grid size-10 shrink-0 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep',
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          'absolute size-[1.15rem] transition-all ease-out [transition-duration:400ms]',
          mounted && dark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-180 scale-50 opacity-0',
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          'absolute size-[1.15rem] transition-all ease-out [transition-duration:400ms]',
          mounted && !dark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-180 scale-50 opacity-0',
        )}
      />
    </button>
  );
}
