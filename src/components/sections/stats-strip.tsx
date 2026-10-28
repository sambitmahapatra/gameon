'use client';

import { useRef } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import type { SiteStats } from '@/lib/db';

type StatsStripProps = { stats: SiteStats };

/** Four counters that roll up once the strip scrolls into view (spec 2.4). */
export function StatsStrip({ stats }: StatsStripProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const items = [
    { label: 'Slots open today', value: stats.slotsFreeToday, suffix: '' },
    { label: 'Zones under one roof', value: stats.zonesOpen, suffix: '' },
    { label: 'Tournaments this month', value: stats.tournamentsThisMonth, suffix: '' },
    { label: 'Members on the floor', value: stats.members, suffix: '+' },
  ];

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const cells = gsap.utils.toArray<HTMLElement>('[data-stat-value]', scope.current);

      cells.forEach((cell) => {
        const target = Number(cell.dataset.statValue ?? '0');
        const suffix = cell.dataset.statSuffix ?? '';
        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.1,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            cell.textContent = `${Math.round(counter.value)}${suffix}`;
          },
          scrollTrigger: { trigger: scope.current, start: 'top 85%', once: true },
        });
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div
      ref={scope}
      className="shell grid grid-cols-2 gap-x-6 gap-y-10 border-y border-border py-12 lg:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-2">
          <span
            data-stat-value={item.value}
            data-stat-suffix={item.suffix}
            className="font-display text-h2 font-bold tabular-nums text-cyan"
          >
            {item.value}
            {item.suffix}
          </span>
          <span className="text-meta text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
