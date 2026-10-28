import Link from 'next/link';

import { Magnetic } from '@/components/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/site';

/**
 * Full-bleed conic gradient, cyan through purple to orange, rotating once every
 * 30s (V2 fix 3b). The rotation is a transform on a blurred layer, so it stays
 * on the compositor, and it stops under prefers-reduced-motion.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="mesh-conic absolute left-1/2 top-1/2 size-[140vmax] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[80px]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-10 [background-size:48px_48px]"
      />

      <Reveal className="shell relative flex flex-col items-start gap-7 py-24">
        <h2 className="max-w-[20ch] text-h1">Your rig is waiting</h2>
        <p className="max-w-prose text-body text-muted-foreground">
          Reserve a slot now, or walk in any time between 10 AM and 10 PM. Powai locals,
          we are a five-minute auto from Hiranandani Gardens.
        </p>
        <div className="flex flex-wrap gap-4">
          <Magnetic>
            <Button asChild size="lg">
              <Link href="/book">Book a Session</Link>
            </Button>
          </Magnetic>
          <Button asChild size="lg" variant="outline">
            <a href={SITE.whatsappUrl}>Ask us on WhatsApp</a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
