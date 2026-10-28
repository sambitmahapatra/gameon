'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

import { Magnetic } from '@/components/magnetic';
import { Spotlight } from '@/components/spotlight';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, useGSAP } from '@/lib/gsap';
import { BLUR_DATA_URL, heroImage } from '@/lib/images';

const HEADLINE = ["Powai's", 'premier', 'gaming', 'café'];

const STATS = [
  { label: 'Zones under one roof', value: 6, prefix: '', suffix: '' },
  { label: 'Open daily', value: 12, prefix: '', suffix: ' hours' },
  { label: 'Walk-ins from', value: 350, prefix: '₹', suffix: '/hour' },
];

/**
 * The orchestrated entrance (V2 fix 4a), 2.3s end to end:
 *   0.0s  grain fades in
 *   0.2s  mesh blobs bloom from 0.5
 *   0.4s  the location tag slides up
 *   0.7s  headline words unmask bottom-up with clip-path — the signature beat
 *   1.5s  sub-line resolves out of a 20px blur
 *   1.9s  CTAs rise with a slight scale
 *   2.3s  stat numbers count up from zero
 *
 * Under prefers-reduced-motion every element is set straight to its end state.
 */
export function Hero() {
  const scope = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      const q = gsap.utils.selector(scope.current);
      const grain = document.querySelector('[data-grain]');
      const words = q('[data-hero-word]');
      const blobs = q('[data-hero-blob]');
      const tag = q('[data-hero-tag]');
      const sub = q('[data-hero-sub]');
      const ctas = q('[data-hero-cta]');
      const statRow = q('[data-hero-stats]');
      const numbers = q('[data-hero-number]');

      if (reduced) {
        gsap.set([...words, ...tag, ...sub, ...ctas, ...statRow], {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 0.0s — the texture settles before anything moves
      if (grain) {
        tl.fromTo(
          grain,
          { opacity: 0 },
          { opacity: 'var(--grain-overlay)', duration: 0.4 },
          0,
        );
      }

      tl
        // 0.2s — mesh blobs bloom
        .fromTo(
          blobs,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
          0.2,
        )

        // 0.4s — location tag
        .fromTo(tag, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.4)

        // 0.7s — the headline, one word at a time, masked bottom-up
        .fromTo(
          words,
          { clipPath: 'inset(100% 0 0 0)', y: '0.12em' },
          {
            clipPath: 'inset(0% 0 0 0)',
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
          },
          0.7,
        )

        // 1.5s — sub-line resolves out of a blur
        .fromTo(
          sub,
          { opacity: 0, filter: 'blur(20px)' },
          { opacity: 1, filter: 'blur(0px)', duration: 0.6 },
          1.5,
        )

        // 1.9s — CTAs
        .fromTo(
          ctas,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
          1.9,
        )

        // 2.3s — the stats row, then its numbers run up
        .fromTo(statRow, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 2.3);

      numbers.forEach((node) => {
        const target = Number((node as HTMLElement).dataset.heroNumber ?? '0');
        const counter = { value: 0 };
        tl.to(
          counter,
          {
            value: target,
            duration: 1,
            ease: 'power2.out',
            snap: { value: 1 },
            onUpdate: () => {
              node.textContent = new Intl.NumberFormat('en-IN').format(
                Math.round(counter.value),
              );
            },
          },
          2.3,
        );
      });

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
      {/* Photographic base, blurred and dimmed so type stays readable */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src={heroImage(2400)}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="scale-105 object-cover opacity-50 blur-[2px]"
        />
        <div className="absolute inset-0 bg-deep/75" />
      </div>

      {/* Animated mesh over the photo */}
      <div
        aria-hidden="true"
        data-hero-blob
        className="mesh-hero pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        data-hero-blob
        className="pointer-events-none absolute -left-40 top-1/4 size-[32rem] rounded-full bg-cyan/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        data-hero-blob
        className="pointer-events-none absolute -right-32 bottom-0 size-[26rem] rounded-full bg-ember/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.07] [background-size:72px_72px]"
      />
      <Spotlight />

      <div className="shell relative w-full py-24">
        <p data-hero-tag className="eyebrow gs-rise">
          Hiranandani Gardens, Powai
        </p>

        <h1
          id="hero-headline"
          className="mt-6 max-w-[18ch] text-hero"
          aria-label={HEADLINE.join(' ')}
        >
          {HEADLINE.map((word) => (
            <span
              key={word}
              aria-hidden="true"
              className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <span data-hero-word className="gs-word inline-block">
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero-sub
          className="gs-hidden mt-7 max-w-prose text-body text-muted-foreground"
        >
          Six worlds. One roof. Zero compromises. VR free-roam, a real 737 cockpit, motion
          racing rigs, tournament PCs, a console lounge and streaming pods.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic data-hero-cta className="gs-rise">
            <Button asChild size="lg">
              <Link href="/book">Book a Session</Link>
            </Button>
          </Magnetic>
          <div data-hero-cta className="gs-rise">
            <Button asChild size="lg" variant="outline">
              <Link href="#zones">See Zones</Link>
            </Button>
          </div>
        </div>

        <dl
          data-hero-stats
          className="gs-hidden mt-16 flex flex-wrap items-start gap-x-8 gap-y-6"
        >
          {STATS.map((stat, index) => (
            <div key={stat.label} className="flex items-start gap-8">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="h-10 w-px bg-gradient-to-b from-transparent via-cyan/50 to-transparent"
                />
              ) : null}
              <div className="flex flex-col gap-1">
                <dd className="font-mono text-data text-foreground">
                  {stat.prefix ? (
                    <span className="text-[0.85em] text-muted-foreground">
                      {stat.prefix}
                    </span>
                  ) : null}
                  <span data-hero-number={stat.value}>{stat.value}</span>
                  {stat.suffix ? (
                    <span className="text-muted-foreground">{stat.suffix}</span>
                  ) : null}
                </dd>
                <dt className="text-meta text-muted-foreground">{stat.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#zones"
        aria-label="Scroll to zones"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-cyan/50 hover:text-cyan motion-safe:animate-drift-y md:block"
      >
        <ChevronDown aria-hidden="true" className="size-4" />
      </a>
    </section>
  );
}
