'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Users } from 'lucide-react';

import { ZoneVisual } from '@/components/zone-visual';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap } from '@/lib/gsap';
import type { Zone } from '@/lib/types';
import { cn, inr } from '@/lib/utils';
import { zoneImage } from '@/lib/zone-images';

type ZoneCardProps = {
  zone: Zone;
  href?: string;
  className?: string;
};

const MAX_TILT_X = 4;
const MAX_TILT_Y = 8;

/**
 * Spec 7.2: image left, content right, 3D tilt that follows the cursor.
 * The tilt is a GSAP quickTo so the card eases instead of snapping, and it is
 * skipped entirely under prefers-reduced-motion.
 */
export function ZoneCard({ zone, href, className }: ZoneCardProps) {
  const card = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const tilt = useRef<{
    x: ReturnType<typeof gsap.quickTo>;
    y: ReturnType<typeof gsap.quickTo>;
  } | null>(null);

  function ensureTilt() {
    if (!card.current || tilt.current) return tilt.current;
    tilt.current = {
      x: gsap.quickTo(card.current, 'rotationX', { duration: 0.4, ease: 'power2.out' }),
      y: gsap.quickTo(card.current, 'rotationY', { duration: 0.4, ease: 'power2.out' }),
    };
    return tilt.current;
  }

  function onMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced || !card.current) return;
    const handles = ensureTilt();
    if (!handles) return;

    const box = card.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;

    handles.x(-py * MAX_TILT_X * 2);
    handles.y(px * MAX_TILT_Y * 2);
  }

  function onLeave() {
    if (reduced) return;
    const handles = ensureTilt();
    handles?.x(0);
    handles?.y(0);
  }

  return (
    <div className="tilt-stage">
      <Link
        ref={card}
        href={href ?? `/zones/${zone.id}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ transformStyle: 'preserve-3d' }}
        className={cn(
          'group relative flex h-36 overflow-hidden rounded-card border border-border bg-surface transition-[border-color,transform,box-shadow] duration-300 hover:border-cyan/60 motion-safe:hover:scale-[1.02] sm:h-40',
          className,
        )}
      >
        <ZoneVisual
          accent={zone.accent_hex}
          src={zoneImage(zone)}
          alt={`${zone.name} at GameOn Powai`}
          className="w-[38%] shrink-0"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-h3 leading-tight">{zone.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-meta text-muted-foreground">
              {zone.tagline}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-data text-foreground">
              {inr(zone.price_per_hour)}/hour
            </span>
            <span className="inline-flex items-center gap-1.5 text-meta text-muted-foreground">
              <Users className="size-3.5" />
              up to {zone.capacity}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${zone.accent_hex ?? '#00E5FF'}, transparent)`,
          }}
        />
      </Link>
    </div>
  );
}
