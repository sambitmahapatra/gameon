'use client';

import { useEffect, useRef, useState } from 'react';

import { api, cn } from '@/lib/utils';

/**
 * The nav's "Live now N players" pill. Polls /api/live-count every 10s and
 * steps the digits toward the new figure so it ticks rather than jumps; a
 * failed poll keeps the last good number.
 *
 * The pulsing ring is pure CSS (.live-pill__dot::before), so it costs nothing
 * and stops under prefers-reduced-motion with the rest of the animations.
 */
export function LiveCounter({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [display, setDisplay] = useState(0);
  const shown = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(api('/api/live-count'), { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { count?: number; data?: { count: number } };
        const next = data.data?.count ?? data.count;
        if (!cancelled && typeof next === 'number') setCount(next);
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

  return (
    <div className={cn('live-pill', className)}>
      <span className="live-pill__dot" aria-hidden="true" />
      <span>
        {count === null ? (
          'Checking the floor'
        ) : (
          <>
            Live now <b>{display}</b> players
          </>
        )}
      </span>
    </div>
  );
}
