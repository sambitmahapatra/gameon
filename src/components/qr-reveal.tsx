'use client';

import { useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';

type QrRevealProps = {
  /** Flat row-major bitmap from QRCode.create(...).modules */
  bits: number[];
  size: number;
  label: string;
  /** Rendered pixel size of the whole symbol. */
  px?: number;
};

/**
 * The QR code draws itself in: modules scale up from the centre outwards over
 * ~1.2s (V2 fix 4g). Drawing strokes was the original idea, but the symbol is
 * solid squares, so the modules themselves are the thing to animate.
 *
 * The matrix is rendered server-side, so the code is in the HTML and scans even
 * if the animation never runs.
 */
export function QrReveal({ bits, size, label, px = 240 }: QrRevealProps) {
  const scope = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const modules = gsap.utils.toArray<SVGRectElement>(
        '[data-qr-module]',
        scope.current,
      );
      if (!modules.length) return;

      const tween = gsap.from(modules, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: { amount: 0.7, from: 'center', grid: [size, size] },
      });

      return () => tween.kill();
    },
    { scope, dependencies: [reduced, size] },
  );

  return (
    <svg
      ref={scope}
      viewBox={`0 0 ${size} ${size}`}
      width={px}
      height={px}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {bits.map((bit, index) => {
        if (!bit) return null;
        const x = index % size;
        const y = Math.floor(index / size);
        return (
          <rect
            key={index}
            data-qr-module
            x={x}
            y={y}
            width={1}
            height={1}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
