import { cn } from '@/lib/utils';

/**
 * Mark: a cyan ">" and a warm "<" overlapping into a stylised G (spec 8.1).
 * Rendered inline so the hero can animate its paths.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-8', className)}
    >
      <path
        d="M9.5 7.5 L18.5 16 L9.5 24.5"
        stroke="hsl(var(--accent-primary))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 7.5 L13.5 16 L22.5 24.5"
        stroke="hsl(var(--accent-warm))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <circle cx="16" cy="16" r="14.5" stroke="hsl(var(--border-subtle))" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">
        GameOn
      </span>
    </span>
  );
}
