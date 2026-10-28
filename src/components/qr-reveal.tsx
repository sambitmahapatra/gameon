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
 * Module outlines draw in before the solid fill over 1.2 seconds. The four-
 * module quiet zone and high-contrast host preserve a scannable final symbol.
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

      const tween = gsap
        .timeline()
        .from(
          modules,
          {
            strokeDasharray: 4,
            strokeDashoffset: 4,
            duration: 0.8,
            stagger: { amount: 0.4 },
            ease: 'power2.out',
          },
          0,
        )
        .from(
          modules,
          {
            fillOpacity: 0,
            duration: 0.35,
            stagger: { amount: 0.7 },
            ease: 'power2.out',
          },
          0.15,
        );

      return () => tween.kill();
    },
    { scope, dependencies: [reduced, size], revertOnUpdate: true },
  );

  return (
    <svg
      ref={scope}
      viewBox={`-4 -4 ${size + 8} ${size + 8}`}
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
            stroke="currentColor"
            strokeWidth={0.08}
          />
        );
      })}
    </svg>
  );
}
