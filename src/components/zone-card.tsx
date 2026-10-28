'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Users } from 'lucide-react';

import { Price } from '@/components/price';
import { ZoneVisual } from '@/components/zone-visual';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { zoneImage } from '@/lib/images';
import type { Zone } from '@/lib/types';
import { cn } from '@/lib/utils';

type ZoneCardProps = {
  zone: Zone;
  /** Where the card links. Pass null for a non-interactive panel. */
  href?: string | null;
  /** Position in a row or grid, used to stagger the scroll-in. */
  index?: number;
  className?: string;
};

const MAX_TILT_X = 4;
const MAX_TILT_Y = 8;
const PARALLAX = 4;

/**
 * Image left, content right, with four distinct motions (V2 fix 4b):
 *   in view  — the card rises 40px while its photo settles from 1.08 to 1.0
 *   hover    — card lifts 6px, photo zooms to 1.1, accent ring pulses once
 *   move     — 3D tilt plus a 4px photo parallax; the text stays put
 *   click    — a brief flash and a 0.98 press before the route changes
 *
 * All of it is skipped under prefers-reduced-motion, where the hover state
 * falls back to the border colour change alone.
 */
export function ZoneCard({ zone, href, index = 0, className }: ZoneCardProps) {
  const scope = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLAnchorElement | HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const flash = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const tilt = useRef<{
    rx: ReturnType<typeof gsap.quickTo>;
    ry: ReturnType<typeof gsap.quickTo>;
    mx: ReturnType<typeof gsap.quickTo>;
    my: ReturnType<typeof gsap.quickTo>;
  } | null>(null);

  useGSAP(
    () => {
      if (reduced || !card.current || !media.current) return;

      tilt.current = {
        rx: gsap.quickTo(card.current, 'rotationX', {
          duration: 0.4,
          ease: 'power2.out',
        }),
        ry: gsap.quickTo(card.current, 'rotationY', {
          duration: 0.4,
          ease: 'power2.out',
        }),
        mx: gsap.quickTo(media.current, 'xPercent', {
          duration: 0.5,
          ease: 'power2.out',
        }),
        my: gsap.quickTo(media.current, 'yPercent', {
          duration: 0.5,
          ease: 'power2.out',
        }),
      };

      const entrance = gsap.timeline({
        delay: index * 0.08,
        scrollTrigger: { trigger: scope.current, start: 'top 90%', once: true },
      });

      entrance
        .fromTo(
          card.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        )
        .fromTo(
          media.current,
          { scale: 1.08 },
          { scale: 1, duration: 1, ease: 'power2.out' },
          '<',
        );

      return () => {
        entrance.kill();
        tilt.current = null;
      };
    },
    { scope, dependencies: [reduced, index] },
  );

  function onEnter() {
    if (reduced || !card.current) return;
    gsap.to(card.current, {
      y: -6,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    if (ring.current) {
      // One pulse, not a loop: it reads as the card acknowledging the cursor.
      gsap.fromTo(
        ring.current,
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => gsap.to(ring.current, { opacity: 0.45, duration: 0.3 }),
        },
      );
    }
  }

  function onMove(event: React.MouseEvent<HTMLElement>) {
    if (reduced || !card.current || !tilt.current) return;

    const box = card.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;

    tilt.current.rx(-py * MAX_TILT_X * 2);
    tilt.current.ry(px * MAX_TILT_Y * 2);
    // Photo drifts, text does not: the 4px parallax (V2 fix 4b)
    tilt.current.mx(px * PARALLAX);
    tilt.current.my(py * PARALLAX);
  }

  function onLeave() {
    if (reduced || !card.current) return;
    gsap.to(card.current, { y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    tilt.current?.rx(0);
    tilt.current?.ry(0);
    tilt.current?.mx(0);
    tilt.current?.my(0);
    if (ring.current) gsap.to(ring.current, { opacity: 0, duration: 0.3 });
  }

  function onPress() {
    if (reduced || !card.current) return;
    gsap.fromTo(
      card.current,
      { scale: 1 },
      { scale: 0.98, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut' },
    );
    if (flash.current) {
      gsap.fromTo(flash.current, { opacity: 0.22 }, { opacity: 0, duration: 0.45 });
    }
  }

  // `href: null` renders a plain panel, for callers that supply their own
  // control — a link inside a button would be invalid markup.
  const Frame = href === null ? 'div' : Link;
  const frameProps =
    href === null ? {} : ({ href: href ?? `/zones/${zone.id}` } as { href: string });

  return (
    <div ref={scope} className="tilt-stage">
      <Frame
        {...(frameProps as { href: string })}
        ref={card as never}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onPress}
        style={{ transformStyle: 'preserve-3d' }}
        className={cn(
          'panel group relative flex h-36 overflow-hidden transition-[border-color] duration-300 hover:border-cyan/60 sm:h-40',
          className,
        )}
      >
        <div ref={media} className="relative w-[38%] shrink-0">
          <ZoneVisual
            accent={zone.accent_hex}
            src={zoneImage(zone, 640)}
            alt={`${zone.name} at GameOn Powai`}
            sizes="(max-width: 768px) 40vw, 240px"
            zoomOnHover
            className="absolute inset-0"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div className="min-w-0">
            <h3 className="truncate font-display text-h3 leading-tight">{zone.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-meta text-muted-foreground">
              {zone.tagline}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Price
              amount={zone.price_per_hour}
              suffix="/hour"
              className="text-data text-foreground"
            />
            <span className="inline-flex items-center gap-1.5 text-meta text-muted-foreground">
              <Users aria-hidden="true" className="size-3.5" />
              up to {zone.capacity}
            </span>
          </div>
        </div>

        {/* Accent ring that pulses on hover */}
        <span
          ref={ring}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-card opacity-0"
          style={{
            boxShadow: `inset 0 0 0 1px ${zone.accent_hex ?? '#00E5FF'}, 0 10px 40px -16px ${
              zone.accent_hex ?? '#00E5FF'
            }`,
          }}
        />

        {/* Click flash */}
        <span
          ref={flash}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-card bg-foreground opacity-0"
        />
      </Frame>
    </div>
  );
}
