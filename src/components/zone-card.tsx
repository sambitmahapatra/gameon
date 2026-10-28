'use client';

import Link from 'next/link';
import { useRef } from 'react';

import { ZoneArt } from '@/components/zone-art';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { Zone } from '@/lib/types';
import { cn, inrDigits } from '@/lib/utils';

type ZoneCardProps = {
  zone: Zone;
  /** Where the card links. `null` renders a plain panel for callers that
   *  provide their own control (the booking wizard's zone buttons). */
  href?: string | null;
  /** Extra line under the capacity, e.g. "40 m² free-roam". */
  detail?: string;
  className?: string;
  /** Distinguishes SVG gradient ids when the same zone appears twice. */
  uid?: string;
};

const MAX_TILT_X = 6;
const MAX_TILT_Y = 8;

/** Second meta line per zone, from the reference copy. */
export const ZONE_DETAIL: Record<string, string> = {
  'vr-arena': '40 m² free-roam',
  'flight-sim': 'Instructor included',
  'racing-cockpit': 'Triple curved screens',
  'esports-station': 'Peripherals included',
  'console-lounge': '120+ title library',
  'streaming-pod': 'Scenes preloaded',
};

/**
 * Zone card: art on top, name/rate/tagline/meta below, with the reference's
 * 3D tilt on mouse move. The tilt is written straight to `transform` the way
 * the reference does it — it combines with the CSS hover lift, and clearing
 * the inline style on leave hands the transition back to CSS.
 *
 * Touch and reduced-motion get the hover lift only.
 */
export function ZoneCard({ zone, href, detail, className, uid }: ZoneCardProps) {
  const card = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  function onMove(event: React.MouseEvent) {
    const node = card.current;
    if (reduced || !node) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.transform = `translateY(-6px) perspective(1000px) rotateX(${
      -y * MAX_TILT_X
    }deg) rotateY(${x * MAX_TILT_Y}deg)`;
  }

  function onLeave() {
    if (card.current) card.current.style.transform = '';
  }

  const body = (
    <>
      <div className="zone__art">
        <ZoneArt slug={zone.id} uid={uid ?? `zc-${zone.id}`} />
      </div>
      <div className="zone__body">
        <div className="zone__name">
          <h3>{zone.name}</h3>
          <div className="zone__price">
            <b>₹{inrDigits(zone.price_per_hour)}</b>/hour
          </div>
        </div>
        <p className="zone__tag">{zone.tagline}</p>
        <div className="zone__meta">
          <span>
            <b>Up to {zone.capacity}</b> players
          </span>
          <span>{detail ?? ZONE_DETAIL[zone.id] ?? 'Staff on hand'}</span>
        </div>
      </div>
    </>
  );

  if (href === null) {
    return (
      <article
        ref={card as React.RefObject<HTMLElement>}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn('zone', className)}
      >
        {body}
      </article>
    );
  }

  return (
    <Link
      ref={card as React.RefObject<HTMLAnchorElement>}
      href={href ?? `/zones/${zone.id}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('zone', className)}
      aria-label={`${zone.name} — ₹${inrDigits(zone.price_per_hour)} an hour`}
    >
      {body}
    </Link>
  );
}
