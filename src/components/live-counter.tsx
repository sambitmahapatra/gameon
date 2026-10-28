'use client';

import { useEffect, useRef, useState } from 'react';

import { api, cn } from '@/lib/utils';

/**
 * "47 players in-house right now" (spec 3.4.3). Polls every 10s and rolls the
 * digits to the new figure; a failed poll keeps the last good number.
 */
export function LiveCounter({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const shown = useRef(0);
  const [display, setDisplay] = useState(0);

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

  if (count === null) {
    return (
      <span className={cn('text-meta text-muted-foreground', className)}>
        Checking the floor
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2 text-meta', className)}>
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-cyan" />
      </span>
      <span className="text-muted-foreground">
        Live now <span className="font-mono text-foreground">{display}</span> players
      </span>
    </span>
  );
}
