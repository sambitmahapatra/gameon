import { Reveal } from '@/components/motion/reveal';
import { ZoneCard } from '@/components/zone-card';
import type { Zone } from '@/lib/types';

/** Reference order: VR, Flight, Racing, Esports, Console, Streaming. */
const ORDER = [
  'vr-arena',
  'flight-sim',
  'racing-cockpit',
  'esports-station',
  'console-lounge',
  'streaming-pod',
];

function ordered(zones: Zone[]) {
  return [...zones].sort((a, b) => {
    const ai = ORDER.indexOf(a.id);
    const bi = ORDER.indexOf(b.id);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function ZonesGrid({ zones }: { zones: Zone[] }) {
  return (
    <section className="section" id="zones">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Six zones</div>
          <h2>Choose your world</h2>
          <p className="sub">
            From VR dogfights to F1 racing, every zone is a complete experience with its
            own rig, its own room and its own rate.
          </p>
        </Reveal>

        <Reveal className="zones-grid" stagger=".zone">
          {ordered(zones).map((zone) => (
            <ZoneCard key={zone.id} zone={zone} href={`/zones/${zone.id}`} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
