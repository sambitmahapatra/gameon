'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks prefers-reduced-motion. Starts at `true` so nothing animates before
 * the first client check — motion is opt-in, never a flash of movement.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
