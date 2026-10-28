import Link from 'next/link';

import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/site';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 bg-grid-faint [background-size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[140px]"
      />

      <Reveal className="shell relative flex flex-col items-start gap-7 py-24">
        <h2 className="max-w-[20ch] text-h1">Your rig is waiting</h2>
        <p className="max-w-prose text-body text-muted-foreground">
          Reserve a slot now, or walk in any time between 10 AM and 10 PM. Powai locals, we
          are a five-minute auto from Hiranandani Gardens.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/book">Book a Session</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={SITE.whatsappUrl}>Ask us on WhatsApp</a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
