'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

/** GameOn surfaces, accent on the action button, theme follows next-themes. */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'rounded-card border border-border bg-surface font-sans text-meta text-foreground shadow-panel',
          description: 'text-muted-foreground',
          actionButton: 'rounded-button bg-cyan font-semibold text-cyan-foreground',
          cancelButton: 'rounded-button bg-elevated text-muted-foreground',
          error: 'border-destructive/40',
          success: 'border-cyan/40',
        },
      }}
    />
  );
}
