'use client';

import { useEffect, useState } from 'react';

import { api, cn } from '@/lib/utils';

/**
 * The nav's "Live now N players" pill. Polls every four seconds, rolling the
 * previous figure out as the next rolls in. Failed polls keep the last count.
 *
 * The pulsing ring is pure CSS (.live-pill__dot::before), so it costs nothing
 * and stops under prefers-reduced-motion with the rest of the animations.
 */
export function LiveCounter({ className }: { className?: string }) {
  const [count, setCount] = useState<{ value: number; previous: number } | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(api('/api/live-count'), { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) setUnavailable(true);
          return;
        }
        const data = (await res.json()) as { count?: number; data?: { count: number } };
        const next = data.data?.count ?? data.count;
        if (!cancelled) setUnavailable(false);
        if (!cancelled && typeof next === 'number')
          setCount((current) =>
            current?.value === next
              ? current
              : { value: next, previous: current?.value ?? next },
          );
      } catch {
        if (!cancelled) setUnavailable(true);
      }
    }

    poll();
    const id = window.setInterval(poll, 4_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className={cn('live-pill', className)}>
      <span className="live-pill__dot" aria-hidden="true" />
      <span>
        {unavailable ? (
          'Live count unavailable'
        ) : count === null ? (
          'Checking the floor'
        ) : (
          <>
            Live now{' '}
            <b className="live-number" key={count.value}>
              <span className="live-number__old" aria-hidden="true">
                {count.previous}
              </span>
              <span className="live-number__new">{count.value}</span>
            </b>{' '}
            players
          </>
        )}
      </span>
    </div>
  );
}
