'use client';

import { Check } from 'lucide-react';

export const STEP_LABELS = ['Zone', 'Time', 'Details', 'Confirm'] as const;

/**
 * Dots joined by lines, one label under each. The active dot carries the
 * reference's pulsing ring (the same CSS animation as the nav's live dot), and
 * the connector fills as steps complete — both pure CSS, so there is no
 * scroll trigger to fail and nothing to leave hidden.
 */
export function BookingProgress({ step }: { step: number }) {
  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-start">
        {STEP_LABELS.map((label, index) => {
          const position = index + 1;
          const complete = position < step;
          const active = position === step;

          return (
            <li
              key={label}
              className="flex min-w-0 flex-1 flex-col gap-2.5"
              aria-current={active ? 'step' : undefined}
            >
              <div className="flex items-center">
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${index === 0 ? 'bg-transparent' : complete || active ? 'bg-brand' : 'bg-line'}`}
                />

                <span className="relative grid size-3.5 shrink-0 place-items-center">
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute size-3.5 rounded-full bg-brand motion-safe:animate-pulse-dot"
                    />
                  ) : null}
                  <span
                    className={`relative grid size-3.5 place-items-center rounded-full border transition-colors duration-300 ${
                      complete || active
                        ? 'border-brand bg-brand'
                        : 'border-line-strong bg-surface'
                    }`}
                  >
                    {complete ? (
                      <Check
                        aria-hidden="true"
                        className="size-2.5 text-brand-foreground"
                        strokeWidth={3}
                      />
                    ) : null}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${
                    index === STEP_LABELS.length - 1
                      ? 'bg-transparent'
                      : complete
                        ? 'bg-brand'
                        : 'bg-line'
                  }`}
                />
              </div>

              <span
                className={`mono text-center ${active ? 'text-brand' : 'text-fg-dim'}`}
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
