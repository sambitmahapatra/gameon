'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';

const TAGLINE = "Powai's premier gaming café";

/** Deterministic scatter positions, so server and client markup agree. */
const PARTICLES = Array.from({ length: 46 }, (_, i) => {
  const golden = 2.399963;
  const radius = 14 + ((i * 37) % 60);
  return {
    x: Math.cos(i * golden) * radius,
    y: Math.sin(i * golden) * radius * 0.55,
    size: i % 7 === 0 ? 3 : 2,
    warm: i % 5 === 0,
  };
});

export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      const headline = scope.current.querySelector<HTMLElement>('[data-hero-headline]');
      const chars = gsap.utils.toArray<HTMLElement>('[data-hero-char]', scope.current);
      const particles = gsap.utils.toArray<HTMLElement>(
        '[data-hero-particle]',
        scope.current,
      );
      const rest = gsap.utils.toArray<HTMLElement>('[data-hero-rise]', scope.current);

      if (reduced) {
        // No motion: everything is simply present.
        gsap.set([headline, ...chars, ...rest], { opacity: 1, y: 0 });
        gsap.set(particles, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. The mark assembles: particles converge on the logo, then hand over.
      tl.set(particles, { opacity: 0.9 })
        .from(particles, {
          x: (index) => PARTICLES[index % PARTICLES.length].x * 6,
          y: (index) => PARTICLES[index % PARTICLES.length].y * 6,
          scale: 0.4,
          duration: 0.8,
          stagger: { amount: 0.3, from: 'random' },
        })
        .to(particles, { opacity: 0, duration: 0.3 }, '-=0.15')
        .from('[data-hero-mark]', { scale: 0.85, opacity: 0, duration: 0.5 }, '-=0.5')

        // 2. Tagline types in, character by character.
        .to(chars, { opacity: 1, duration: 0.01, stagger: 0.022 }, 0.8)

        // 3. Sub-line, then 4. the two CTAs rise in.
        .to(rest, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.4);

      return () => tl.kill();
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* Drifting field behind the content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.07] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 size-[32rem] rounded-full bg-cyan/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-ember/10 blur-[120px]"
      />

      <div className="shell relative w-full py-24">
        <div className="flex items-center gap-4" data-hero-mark>
          <div className="relative size-10">
            {/* Particles live in the same box as the mark so they converge on it */}
            <div aria-hidden="true" className="absolute inset-0">
              {PARTICLES.map((particle, index) => (
                <span
                  key={index}
                  data-hero-particle
                  className="absolute left-1/2 top-1/2 rounded-full opacity-0"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    marginLeft: particle.x * 0.32,
                    marginTop: particle.y * 0.32,
                    backgroundColor: particle.warm
                      ? 'hsl(var(--accent-warm))'
                      : 'hsl(var(--accent-primary))',
                  }}
                />
              ))}
            </div>
          </div>
          <p className="eyebrow">{'Hiranandani Gardens, Powai'}</p>
        </div>

        <h1
          id="hero-headline"
          data-hero-headline
          className="mt-6 max-w-[18ch] text-hero"
          aria-label={TAGLINE}
        >
          {TAGLINE.split('').map((char, index) => (
            <span
              key={index}
              data-hero-char
              aria-hidden="true"
              className="opacity-0"
              style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
            >
              {char}
            </span>
          ))}
        </h1>

        <p
          data-hero-rise
          className="mt-7 max-w-prose translate-y-4 text-body text-muted-foreground opacity-0"
        >
          Six worlds. One roof. Zero compromises. VR free-roam, a real 737 cockpit, motion
          racing rigs, tournament PCs, a console lounge and streaming pods.
        </p>

        <div
          data-hero-rise
          className="mt-10 flex translate-y-4 flex-wrap gap-4 opacity-0"
        >
          <Button asChild size="lg">
            <Link href="/book">Book a Session</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#zones">See Zones</Link>
          </Button>
        </div>

        <dl
          data-hero-rise
          className="mt-16 flex translate-y-4 flex-wrap gap-x-10 gap-y-4 opacity-0"
        >
          {[
            ['Zones under one roof', '6'],
            ['Open daily', '10 AM to 10 PM'],
            ['Walk-ins from', '₹350/hour'],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <dd className="font-mono text-data text-foreground">{value}</dd>
              <dt className="text-meta text-muted-foreground">{label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#zones"
        aria-label="Scroll to zones"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan motion-safe:animate-drift-y md:block"
      >
        <ChevronDown className="size-4" />
      </a>
    </section>
  );
}
