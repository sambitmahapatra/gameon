'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * The route template remounts this entry transition. Server HTML stays visible,
 * and the motion preference is checked before starting an animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const controls = useAnimationControls();
  useEffect(() => {
    if (reduced) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }
    controls.set({ opacity: 0, y: 12 });
    void controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
    });
    return () => controls.stop();
  }, [reduced, controls]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial={false} animate={controls}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
