'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export const STEP_LABELS = ['Zone', 'Time', 'Details', 'Confirm'] as const;

/** Spec 7.4: four dots, filling line, label under each dot. */
export function BookingProgress({ step }: { step: number }) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-start">
        {STEP_LABELS.map((label, index) => {
          const position = index + 1;
          const complete = position < step;
          const active = position === step;

          return (
            <li
              key={label}
              className={cn('flex min-w-0 flex-1 flex-col gap-2', index > 0 && '-ml-1')}
              aria-current={active ? 'step' : undefined}
            >
              <div className="flex items-center">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px flex-1 transition-colors duration-500',
                      complete || active ? 'bg-cyan' : 'bg-border',
                    )}
                  />
                ) : (
                  <span aria-hidden="true" className="flex-1" />
                )}

                <span
                  className={cn(
                    'flex size-3 shrink-0 items-center justify-center rounded-full border transition-colors duration-300',
                    complete && 'border-cyan bg-cyan',
                    active && 'border-cyan bg-cyan motion-safe:animate-slot-pulse',
                    !complete && !active && 'border-border bg-surface',
                  )}
                >
                  {complete ? <Check className="size-2 text-cyan-foreground" /> : null}
                </span>

                {index < STEP_LABELS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px flex-1 transition-colors duration-500',
                      complete ? 'bg-cyan' : 'bg-border',
                    )}
                  />
                ) : (
                  <span aria-hidden="true" className="flex-1" />
                )}
              </div>

              <span
                className={cn(
                  'text-center text-meta transition-colors',
                  active ? 'text-cyan' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
