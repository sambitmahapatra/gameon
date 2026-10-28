'use client';

import { useRef } from 'react';
import { Check } from 'lucide-react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export const STEP_LABELS = ['Zone', 'Time', 'Details', 'Confirm'] as const;

/**
 * Four dots, a filling line and a label under each (spec 7.4). V2 fix 4e adds
 * the expanding ring on the active dot and eases the line fill rather than
 * letting it run linearly.
 */
export function BookingProgress({ step }: { step: number }) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const fills = gsap.utils.toArray<HTMLElement>(
        '[data-progress-fill]',
        scope.current,
      );
      gsap.to(fills, {
        scaleX: (index, target: HTMLElement) =>
          target.dataset.progressFill === 'done' ? 1 : 0,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.05,
      });

      const ring = scope.current.querySelector('[data-progress-ring]');
      if (!ring) return;

      const pulse = gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.6 },
        {
          scale: 2.6,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 0.15,
        },
      );

      return () => pulse.kill();
    },
    { scope, dependencies: [reduced, step] },
  );

  return (
    <nav ref={scope} aria-label="Booking progress" className="w-full">
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
                  <span aria-hidden="true" className="relative h-px flex-1 bg-border">
                    <span
                      data-progress-fill={complete || active ? 'done' : 'pending'}
                      className={cn(
                        'absolute inset-0 origin-left bg-cyan',
                        complete || active ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </span>
                ) : (
                  <span aria-hidden="true" className="flex-1" />
                )}

                <span className="relative grid size-3 shrink-0 place-items-center">
                  {active ? (
                    <span
                      data-progress-ring
                      aria-hidden="true"
                      className="absolute size-3 rounded-full bg-cyan"
                    />
                  ) : null}
                  <span
                    className={cn(
                      'relative flex size-3 items-center justify-center rounded-full border transition-colors duration-300',
                      complete && 'border-cyan bg-cyan',
                      active && 'border-cyan bg-cyan',
                      !complete && !active && 'border-border bg-surface',
                    )}
                  >
                    {complete ? (
                      <Check aria-hidden="true" className="size-2 text-cyan-foreground" />
                    ) : null}
                  </span>
                </span>

                {index < STEP_LABELS.length - 1 ? (
                  <span aria-hidden="true" className="relative h-px flex-1 bg-border">
                    <span
                      data-progress-fill={complete ? 'done' : 'pending'}
                      className={cn(
                        'absolute inset-0 origin-left bg-cyan',
                        complete ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </span>
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
