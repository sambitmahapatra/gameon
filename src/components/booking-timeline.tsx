'use client';

import { useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

const STAGES = [
  { label: 'Reserved', note: 'Slot held in your name' },
  { label: 'En route', note: 'Show the QR at the counter' },
  { label: 'Checked in', note: 'Staff walk you to the rig' },
] as const;

/**
 * Spec 3.4.6: the dot travels the timeline as the page scrolls, while only the
 * first stage is actually complete.
 */
export function BookingTimeline({ active = 0 }: { active?: number }) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const fill = scope.current.querySelector<HTMLElement>('[data-timeline-fill]');
      const dot = scope.current.querySelector<HTMLElement>('[data-timeline-dot]');
      if (!fill || !dot) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        })
        .fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(dot, { left: '0%' }, { left: '100%', ease: 'none' }, 0);
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope} className="flex flex-col gap-5">
      <div className="relative mx-[0.5rem] h-px bg-border">
        <span
          data-timeline-fill
          aria-hidden="true"
          className="absolute inset-0 origin-left bg-gradient-to-r from-brand to-brand/20"
        />
        <span
          data-timeline-dot
          aria-hidden="true"
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-glow"
        />
      </div>

      <ol className="grid grid-cols-3 gap-4">
        {STAGES.map((stage, index) => (
          <li key={stage.label} className="flex flex-col gap-1.5">
            <span
              className={cn(
                'text-meta',
                index <= active ? 'text-brand' : 'text-muted-foreground',
              )}
            >
              {stage.label}
            </span>
            <span className="text-meta text-muted-foreground">{stage.note}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
