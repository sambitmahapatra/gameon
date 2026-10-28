'use client';

import { Toaster as SonnerToaster } from 'sonner';

/** Single dark theme, GameOn surfaces, cyan accent on the action button. */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'rounded-card border border-border bg-surface text-foreground font-sans text-meta shadow-panel',
          description: 'text-muted-foreground',
          actionButton: 'rounded-button bg-cyan text-cyan-foreground font-semibold',
          cancelButton: 'rounded-button bg-elevated text-muted-foreground',
          error: 'border-destructive/40',
          success: 'border-cyan/40',
        },
      }}
    />
  );
}
