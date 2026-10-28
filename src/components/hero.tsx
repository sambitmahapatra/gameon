'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { HeroVisual } from '@/components/hero-visual';
import { Magnetic } from '@/components/magnetic';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

const WORDS = [
  { text: 'GameOn', em: false },
  { text: 'break', em: false },
  { text: 'Enter', em: true },
  { text: 'another', em: true },
  { text: 'world.', em: true },
] as const;

/**
 * The hero: clip-path word reveal on the headline, a spotlight that follows
 * the cursor, drifting mesh blobs and the orbital visual.
 *
 * The headline words start at their resting position in the markup. GSAP
 * animates *from* a 100% offset only once the client confirms motion is
 * allowed, so with JavaScript off, or under reduced motion, the headline is
 * simply there (guardrail #1).
 */
export function Hero({ openSlots }: { openSlots: number }) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const hero = scope.current;
    if (reduced || !hero) return;
    const visual = hero.querySelector<HTMLElement>('[data-hero-parallax]');
    const dot = hero.querySelector<HTMLElement>('[data-cursor-dot]');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let frame = 0;
    let x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    let inside = false;
    const move = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      targetX = event.clientX - box.left;
      targetY = event.clientY - box.top;
      if (!inside) {
        x = targetX;
        y = targetY;
      }
      inside = true;
    };
    const leave = () => {
      inside = false;
    };
    const tick = () => {
      const box = hero.getBoundingClientRect();
      if (visual && box.bottom > 0)
        visual.style.transform = `translate3d(0, ${Math.min(box.height, Math.max(0, -box.top)) * -0.5}px, 0)`;
      if (dot && fine) {
        x += (targetX - x) * 0.15;
        y += (targetY - y) * 0.15;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        dot.style.opacity = inside ? '1' : '0';
      }
      frame = requestAnimationFrame(tick);
    };
    if (fine) {
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', leave);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      if (visual) visual.style.transform = '';
      if (dot) dot.style.opacity = '0';
    };
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced || !scope.current) return;

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .from('[data-hero-eyebrow]', { opacity: 0, y: 12, duration: 0.6 }, 0)
        .from('[data-hero-visual]', { opacity: 0, scale: 0.9, duration: 1.2 }, 0.3)
        .from(
          '[data-hero-word] > span',
          { yPercent: 100, duration: 0.9, stagger: 0.07 },
          0.1,
        )
        .from('[data-hero-sub]', { opacity: 0, y: 16, duration: 0.7 }, 0.7)
        .from('[data-hero-ctas]', { opacity: 0, y: 16, duration: 0.6 }, 0.9)
        .from(
          '[data-hero-stat]',
          { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 },
          1.1,
        );

      // The rate counts up; the other two stats are already small numbers.
      const rate = scope.current.querySelector('[data-hero-rate]');
      if (rate) {
        const target = { v: 0 };
        timeline.to(
          target,
          {
            v: 350,
            duration: 1.4,
            onUpdate: () => {
              rate.textContent = `₹${Math.round(target.v)}`;
            },
          },
          1.3,
        );
      }

      // Spotlight follows the cursor, fine pointers only.
      const hero = scope.current;
      const spotlight = hero.querySelector<HTMLElement>('[data-hero-spotlight]');
      if (
        !spotlight ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches
      ) {
        return () => timeline.kill();
      }

      const onMove = (event: MouseEvent) => {
        const box = hero.getBoundingClientRect();
        spotlight.style.setProperty(
          '--mx',
          `${((event.clientX - box.left) / box.width) * 100}%`,
        );
        spotlight.style.setProperty(
          '--my',
          `${((event.clientY - box.top) / box.height) * 100}%`,
        );
      };

      hero.addEventListener('mousemove', onMove);
      return () => {
        hero.removeEventListener('mousemove', onMove);
        timeline.kill();
      };
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={scope} className="hero" id="top">
      <div className="hero__mesh" aria-hidden="true" />
      <div className="hero__spotlight" data-hero-spotlight aria-hidden="true" />
      <div className="hero__cursor" data-cursor-dot aria-hidden="true" />

      <div className="wrap hero__inner">
        <div>
          <div className="eyebrow hero__eyebrow" data-hero-eyebrow>
            The flagship opens this quarter
          </div>

          <h1 aria-label="GameOn. Enter another world.">
            {WORDS.map((word, index) =>
              word.text === 'break' ? (
                <br key="break" />
              ) : (
                <span
                  className={cn('word', word.em && 'word--tagline')}
                  data-hero-word
                  key={index}
                  aria-hidden="true"
                >
                  <span>{word.em ? <em>{word.text}</em> : word.text}</span>
                </span>
              ),
            )}
          </h1>

          <p className="hero__sub" data-hero-sub>
            A grown-up gaming lounge. VR free-roam, a real 737 cockpit, motion racing
            rigs, tournament PCs, a console lounge and streaming pods — in one serious
            premium venue, with a café that actually feeds you.
          </p>

          <div className="hero__ctas" data-hero-ctas>
            <Magnetic>
              <Link href="/book" className="btn btn--primary btn--lg">
                Reserve a rig
              </Link>
            </Magnetic>
            <a href="#zones" className="btn btn--ghost btn--lg">
              See the zones
            </a>
          </div>

          <div className="hero__stats">
            <div data-hero-stat>
              <span className="stat__value">6</span>
              <span className="stat__label">Zones under one roof</span>
            </div>
            <div data-hero-stat>
              <span className="stat__value">
                12<small>h</small>
              </span>
              <span className="stat__label">Open every day</span>
            </div>
            <div data-hero-stat>
              <span className="stat__value">
                <span data-hero-rate>₹350</span>
                <small>/hr</small>
              </span>
              <span className="stat__label">
                {openSlots > 0 ? `${openSlots} slots open today` : 'Walk-ins from'}
              </span>
            </div>
          </div>
        </div>

        <div className="hero__visual" data-hero-visual>
          <div data-hero-parallax>
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
