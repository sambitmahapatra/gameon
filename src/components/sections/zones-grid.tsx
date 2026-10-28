import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { ZoneCard } from '@/components/zone-card';
import type { Zone } from '@/lib/types';

/** Snap-scroll rail on mobile, three columns from lg up (spec 3.3). */
export function ZonesGrid({ zones }: { zones: Zone[] }) {
  return (
    <section id="zones" className="shell scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Six zones"
        title="Choose your world"
        sub="From VR dogfights to F1 racing, every zone is a complete experience with its own rig, its own room and its own rate."
      />

      <Reveal stagger="[data-zone-card]" className="mt-12">
        <div className="snap-rail md:hidden">
          {zones.map((zone) => (
            <div key={zone.id} data-zone-card className="w-[86vw] shrink-0">
              <ZoneCard zone={zone} href={`/book?zone=${zone.id}`} />
            </div>
          ))}
        </div>

        <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <div key={zone.id} data-zone-card>
              <ZoneCard zone={zone} href={`/book?zone=${zone.id}`} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
