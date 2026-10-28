'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    const rippleOrigin = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>('.btn--primary, .shine');
      if (!button) return;
      const box = button.getBoundingClientRect();
      button.style.setProperty('--ripple-x', `${event.clientX - box.left}px`);
      button.style.setProperty('--ripple-y', `${event.clientY - box.top}px`);
    };
    document.addEventListener('pointerdown', rippleOrigin);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('pointerdown', rippleOrigin);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
