'use client';

import { useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Selector for children to stagger; omit to animate the wrapper itself. */
  stagger?: string;
  delay?: number;
  as?: 'div' | 'section' | 'ul' | 'li' | 'header' | 'dl';
};

/**
 * Fade-and-rise on entry — and, more importantly, the one pattern allowed to
 * drive scroll animation in this codebase (V3 guardrail #1).
 *
 * The resting state is *visible*. `gsap.from` with `immediateRender: false`
 * never writes the start values until the trigger actually fires, and
 * `start: 'top bottom'` fires the moment the element's top reaches the
 * viewport bottom — which is already true for anything above the fold. So if
 * ScrollTrigger fails to initialise, or JavaScript never runs at all, the
 * content is simply there. Nothing is left waiting at opacity 0.
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

      const tween = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top bottom',
          toggleActions: 'play none none none',
          once: true,
        },
      });
      tween.from(targets, {
        y: stagger === '.zone' ? 20 : 24,
        scale: stagger === '.zone' ? 0.97 : 1,
        opacity: 0,
        duration: stagger === '.zone' ? 0.6 : 0.7,
        delay,
        ease: 'power2.out',
        stagger:
          stagger === '.zone'
            ? (index: number) => (index < 3 ? index * 0.08 : 0.86 + (index - 3) * 0.08)
            : stagger === '.tier'
              ? 0.1
              : stagger
                ? 0.08
                : 0,
        immediateRender: false,
      });
      if (stagger === '.tier') {
        const silver = scope.current.querySelector('.tier--highlight');
        if (silver)
          tween.fromTo(
            silver,
            { boxShadow: '0 0 0 0 rgb(0 240 255 / .45)' },
            {
              boxShadow: '0 0 0 12px rgb(0 240 255 / 0)',
              duration: 0.65,
              clearProps: 'boxShadow',
              immediateRender: false,
            },
          );
      }

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope, dependencies: [reduced, stagger, delay], revertOnUpdate: true },
  );

  return (
    <Tag ref={scope as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
