'use client';
import { useRef } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';

export function WordReveal({ text }: { text: string }) {
  const scope = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      gsap.from('[data-reveal-word]', {
        yPercent: 100,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <span ref={scope} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span className="reveal-word" aria-hidden="true" key={index}>
          <span data-reveal-word>{word}</span>
        </span>
      ))}
    </span>
  );
}
