import { cn } from '@/lib/utils';

/**
 * Empty states get a small abstract mark rather than a grey box (V3 §5.4):
 * an outlined ring with an off-centre dot, drawn in the accent.
 */
export function EmptyState({
  title,
  note,
  className,
}: {
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-card border border-dashed border-line-strong px-6 py-14 text-center',
        className,
      )}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="size-10">
        <circle
          cx="24"
          cy="24"
          r="17"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle
          cx="24"
          cy="24"
          r="9"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />
        <circle cx="31" cy="17" r="2.5" fill="var(--magenta)" />
      </svg>

      <div>
        <p className="font-display text-[1.1rem] font-medium">{title}</p>
        {note ? <p className="mt-1.5 text-meta text-fg-muted">{note}</p> : null}
      </div>
    </div>
  );
}
