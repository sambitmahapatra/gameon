import Link from 'next/link';

import { Magnetic } from '@/components/magnetic';
import { Reveal } from '@/components/motion/reveal';
import { SITE } from '@/lib/site';

/**
 * Closing panel: two drifting mesh blobs behind the headline. The mesh is
 * absolutely positioned and pointer-events: none, so it never swallows a
 * click meant for the CTAs above it.
 */
export function FinalCta() {
  return (
    <section className="cta-final" id="book">
      <div className="cta-final__mesh" aria-hidden="true" />

      <Reveal className="wrap cta-final__inner">
        <div className="eyebrow">Doors open at 10</div>
        <h2 className="mt-6">Your rig is waiting.</h2>
        <p>
          Reserve a slot now, or walk in and sit at the bar until one opens up. The café
          works until nine-thirty either way.
        </p>
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Link href="/book" className="btn btn--primary btn--lg">
              Reserve a slot
            </Link>
          </Magnetic>
          <a href={SITE.whatsappUrl} className="btn btn--ghost btn--lg">
            Message us on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
