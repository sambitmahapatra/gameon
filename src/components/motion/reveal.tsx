'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Selector for children to stagger; omit to animate the wrapper itself. */
  stagger?: string;
  delay?: number;
  as?: 'div' | 'section' | 'ul' | 'li' | 'header';
};

/**
 * Fade-and-rise on section entry (spec 2.4). One ScrollTrigger per wrapper
 * rather than one per element, so a long page stays cheap.
 */
export function Reveal({
  children,
  className,
  stagger,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(stagger, scope.current)
        : [scope.current];

      if (!targets.length) return;

      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: 'power2.out',
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope, dependencies: [reduced, stagger, delay] },
  );

  return (
    <Tag ref={scope as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
