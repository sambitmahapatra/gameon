'use client';

import { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { api, cn } from '@/lib/utils';

/**
 * "Live now 47 players" (spec 3.4.3). Polls every 10s and steps the digits to
 * the new figure; a failed poll keeps the last good number.
 *
 * The dot is two circles: a solid core and an outer ring that GSAP scales and
 * fades on a loop, so it reads as a heartbeat rather than a blink (V2 fix 5).
 */
export function LiveCounter({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const shown = useRef(0);
  const [display, setDisplay] = useState(0);
  const scope = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(api('/api/live-count'), { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
      } catch {
        // Offline or backend asleep: keep showing the last known figure.
      }
    }

    poll();
    const id = window.setInterval(poll, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // Step the visible number towards the target so it ticks rather than jumps.
  useEffect(() => {
    if (count === null) return;

    const id = window.setInterval(() => {
      const delta = count - shown.current;
      if (delta === 0) {
        window.clearInterval(id);
        return;
      }
      shown.current += Math.sign(delta);
      setDisplay(shown.current);
    }, 40);

    return () => window.clearInterval(id);
  }, [count]);

  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      const ring = scope.current.querySelector('[data-live-ring]');
      if (!ring) return;

      const tween = gsap.fromTo(
        ring,
        { scale: 1, opacity: 0.7 },
        {
          scale: 1.4,
          opacity: 0,
          duration: 1.6,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 0.2,
        },
      );

      return () => tween.kill();
    },
    { scope, dependencies: [reduced, count] },
  );

  if (count === null) {
    return (
      <span className={cn('text-meta text-muted-foreground', className)}>
        Checking the floor
      </span>
    );
  }

  return (
    <span
      ref={scope}
      className={cn('inline-flex items-center gap-2 text-meta', className)}
    >
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        <span
          data-live-ring
          aria-hidden="true"
          className="absolute size-2 rounded-full bg-cyan"
        />
        <span aria-hidden="true" className="relative size-2 rounded-full bg-cyan" />
      </span>
      <span className="text-muted-foreground">
        Live now <span className="font-mono tabular-nums text-foreground">{display}</span>{' '}
        players
      </span>
    </span>
  );
}
