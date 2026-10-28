import { SectionHeading } from '@/components/section-heading';
import { Spotlight } from '@/components/spotlight';
import { ZoneCard } from '@/components/zone-card';
import type { Zone } from '@/lib/types';

/**
 * Snap-scroll rail on mobile, three columns from lg up. The cards animate
 * themselves in, so there is no Reveal wrapper here — two layers of opacity
 * control would fight each other.
 */
export function ZonesGrid({ zones }: { zones: Zone[] }) {
  return (
    <section id="zones" className="relative scroll-mt-24 overflow-hidden py-24">
      <div
        aria-hidden="true"
        className="mesh-corner-left pointer-events-none absolute inset-0"
      />
      <Spotlight />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Six zones"
          title="Choose your world"
          sub="From VR dogfights to F1 racing, every zone is a complete experience with its own rig, its own room and its own rate."
        />

        <div className="mt-12">
          <div className="snap-rail md:hidden">
            {zones.map((zone, index) => (
              <div key={zone.id} className="w-[86vw] shrink-0">
                <ZoneCard zone={zone} href={`/book?zone=${zone.id}`} index={index} />
              </div>
            ))}
          </div>

          <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone, index) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                href={`/book?zone=${zone.id}`}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
