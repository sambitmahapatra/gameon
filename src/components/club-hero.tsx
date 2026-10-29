'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { LiveCounter } from '@/components/live-counter';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';

export function ClubHero({ zoneCount }: { zoneCount: number }) {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from('[data-hero-line]', {
        y: 48,
        opacity: 0,
        rotate: 2,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all',
      });
      gsap.from('[data-hero-detail]', {
        y: 16,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.3,
        clearProps: 'all',
      });
      gsap.to('.club-hero__photo', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    },
    { scope, dependencies: [reduced], revertOnUpdate: true },
  );
  return (
    <section className="club-hero" id="home" ref={scope}>
      <div className="club-hero__photo">
        <Image
          src="/images/club/hero.webp"
          alt="Players at an illuminated competitive gaming arena"
          fill
          sizes="100vw"
          priority
        />
      </div>
      <div className="club-hero__shade" aria-hidden="true" />
      <div className="club-wrap club-hero__inner">
        <div className="club-eyebrow" data-hero-detail>
          <span className="club-dot" /> The gaming social club
        </div>
        <h1>
          <span data-hero-line>Play</span>
          <span data-hero-line>Beyond</span>
          <span data-hero-line className="club-lime">
            Ordinary.
          </span>
        </h1>
        <p data-hero-detail>
          Big-screen battles. Wheel-to-wheel racing. A cockpit in the clouds. Food worth
          staying for. Meet your people at a gaming destination built for the whole
          experience.
        </p>
        <div className="club-actions" data-hero-detail>
          <Link href="#book" className="club-btn">
            Find your next session <ArrowUpRight size={17} />
          </Link>
          <Link href="#zones" className="club-btn club-btn--outline">
            Explore the zones <ArrowDown size={16} />
          </Link>
        </div>
        <div className="club-hero__metrics" data-hero-detail>
          <div>
            <strong>{zoneCount}+</strong>
            <span>Ways to play</span>
          </div>
          <div>
            <strong>12 HRS</strong>
            <span>Daily play window</span>
          </div>
          <div>
            <strong>Play · Eat · Repeat</strong>
            <span>Our kind of night</span>
          </div>
        </div>
        <div className="club-hero__live" data-hero-detail>
          <LiveCounter className="!flex" />
        </div>
      </div>
      <a href="#zones" className="club-scroll-cue" aria-label="Scroll to gaming zones">
        <span>Scroll to play</span>
        <ArrowDown size={16} />
      </a>
    </section>
  );
}
