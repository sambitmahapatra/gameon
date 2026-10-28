'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

const COLORS = ['var(--accent)', 'var(--magenta)', 'var(--amber)', 'var(--violet)'];
const PIECES = 36;

/**
 * One subtle burst in the brand colours when a confirmation page first
 * renders (V3 §5.7). Deliberately small: 36 pieces, 1.4s, transform and
 * opacity only, then the layer removes itself. Skipped entirely under
 * prefers-reduced-motion, and never interactive.
 */
export function Confetti() {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = host.current;
    if (reduced || !node) return;

    const timers: number[] = [];

    for (let i = 0; i < PIECES; i += 1) {
      const piece = document.createElement('span');
      const angle = (i / PIECES) * Math.PI * 2;
      const distance = 120 + Math.random() * 180;

      piece.style.cssText = [
        'position:absolute',
        'top:28%',
        'left:50%',
        'width:6px',
        'height:10px',
        'border-radius:1px',
        `background:${COLORS[i % COLORS.length]}`,
        'opacity:0',
        'will-change:transform,opacity',
      ].join(';');

      node.append(piece);

      piece.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.4) rotate(0deg)', opacity: 1 },
          {
            transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${
              Math.sin(angle) * distance + 80
            }px)) scale(1) rotate(${Math.random() * 540 - 270}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1200 + Math.random() * 400,
          easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
          fill: 'forwards',
        },
      );
    }

    timers.push(window.setTimeout(() => node.replaceChildren(), 1800));
    return () => {
      timers.forEach(window.clearTimeout);
      node.replaceChildren();
    };
  }, [reduced]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    />
  );
}
