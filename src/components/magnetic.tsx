'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** How close the cursor has to come before the pull starts. */
  radius?: number;
  /** Maximum travel from centre. */
  strength?: number;
};

/**
 * Primary CTAs lean toward the cursor once it comes within ~60px, up to 8px of
 * travel, and ease back to centre when it leaves (V2 fix 4h). Pointer-coarse
 * devices and prefers-reduced-motion skip it entirely.
 */
export function Magnetic({
  children,
  className,
  radius = 60,
  strength = 8,
  ...rest
}: MagneticProps & React.HTMLAttributes<HTMLDivElement>) {
  const holder = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = holder.current;
    if (reduced || !node) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const moveX = gsap.quickTo(node, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(node, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMove = (event: MouseEvent) => {
      const box = node.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      // Distance to the button's edge, not its centre, so wide buttons feel right
      const reach =
        Math.hypot(
          Math.max(0, Math.abs(dx) - box.width / 2),
          Math.max(0, Math.abs(dy) - box.height / 2),
        ) || 0;

      if (reach > radius) {
        moveX(0);
        moveY(0);
        return;
      }

      const pull = 1 - reach / radius;
      moveX(gsap.utils.clamp(-strength, strength, dx * 0.4) * pull);
      moveY(gsap.utils.clamp(-strength, strength, dy * 0.4) * pull);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.killTweensOf(node);
    };
  }, [reduced, radius, strength]);

  return (
    <div ref={holder} className={cn('inline-flex', className)} {...rest}>
      {children}
    </div>
  );
}
