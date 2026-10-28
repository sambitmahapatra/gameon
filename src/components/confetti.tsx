'use client';
import { useEffect } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function Confetti() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    void import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.className = 'confetti-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.append(canvas);
      const burst = confetti.create(canvas, { resize: true });
      void burst({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.35 },
        colors: ['#00F0FF', '#FF2E9A', '#A78BFA', '#FFB84D'],
        ticks: 90,
        disableForReducedMotion: true,
      });
      const timer = window.setTimeout(() => {
        burst.reset();
        canvas.remove();
      }, 1500);
      stop = () => {
        window.clearTimeout(timer);
        burst.reset();
        canvas.remove();
      };
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [reduced]);
  return null;
}
