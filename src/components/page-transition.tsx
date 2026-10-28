'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fade-and-rise between routes (V3 §5.1). Deliberately not AnimatePresence:
 * an exit animation would hold the old page while the new one streams in.
 *
 * The first paint is never animated, so the server markup is already at rest
 * and nothing ships at opacity 0 waiting for JS (guardrail #1). Only a route
 * change, which can only happen after hydration, gets the fade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={hydrated ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
