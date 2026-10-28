'use client';

import { useEffect, useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * A soft 400px radial that follows the cursor inside its parent section
 * (V2 fix 3c). The position is lerped by 0.1 each frame, so the light trails
 * the pointer instead of sticking to it.
 *
 * Off for touch pointers and for prefers-reduced-motion. The parent needs
 * `position: relative`.
 */
export function Spotlight() {
  const layer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = layer.current;
    if (reduced || !node) return;

    // Hover-capable pointers only: on a touch screen it would sit where the
    // last tap was and never move.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const section = node.parentElement;
    if (!section) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let visible = false;
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      const box = section.getBoundingClientRect();
      target.x = event.clientX - box.left;
      target.y = event.clientY - box.top;

      if (!visible) {
        visible = true;
        current.x = target.x;
        current.y = target.y;
        node.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      node.style.opacity = '0';
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      // translate3d keeps this on the compositor
      node.style.transform = `translate3d(${current.x - 200}px, ${current.y - 200}px, 0)`;
      frame = window.requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 size-[400px] opacity-0 transition-opacity duration-500"
      style={{
        background:
          'radial-gradient(circle, hsl(var(--accent-primary) / var(--spotlight-strength, 0.08)), transparent 70%)',
      }}
    />
  );
}
