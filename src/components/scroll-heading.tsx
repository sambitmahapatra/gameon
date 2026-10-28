'use client';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';

export function ScrollHeading({ text }: { text: string }) {
  const scope = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      gsap.from('[data-character]', {
        opacity: 0.25,
        stagger: 0.025,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 90%',
          end: 'top 65%',
          scrub: 0.5,
        },
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <h3 ref={scope} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span className="heading-word" key={i} aria-hidden="true">
          {Array.from(word).map((c, j) => (
            <span data-character key={j}>
              {c}
            </span>
          ))}{' '}
        </span>
      ))}
    </h3>
  );
}
