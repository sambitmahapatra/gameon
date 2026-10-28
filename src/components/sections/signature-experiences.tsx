import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { ZoneVisual } from '@/components/zone-visual';
import type { Zone } from '@/lib/types';
import { inr } from '@/lib/utils';
import { zoneImage } from '@/lib/zone-images';

const FEATURED = ['vr-arena', 'flight-sim', 'streaming-pod'];

const PITCH: Record<string, { heading: string; body: string; detail: string[] }> = {
  'vr-arena': {
    heading: 'Walk around inside the game',
    body: 'Most VR you have tried kept you standing still. Our arena tracks your whole body across 40 square metres, so you duck behind real cover and climb real ledges while the headset shows you somewhere else entirely.',
    detail: ['Wireless headsets', 'Up to six players', 'Staff-run setup'],
  },
  'flight-sim': {
    heading: 'Hand-fly an approach into Mumbai',
    body: 'A cockpit replica with the switches where they belong, three curved screens, and an instructor beside you for the first circuit. Beginners take off within ten minutes. Pilots come back for the crosswind landings.',
    detail: ['Full cockpit', 'Briefing included', 'Logbook on request'],
  },
  'streaming-pod': {
    heading: 'Go live without buying a studio',
    body: 'A sound-treated booth with the camera, mic and lighting already dialled in, and OBS scenes ready to go. Sign in to your own accounts, stream, then take the local recording home.',
    detail: ['Broadcast audio', 'Two cameras', 'Files to take away'],
  },
};

export function SignatureExperiences({ zones }: { zones: Zone[] }) {
  const featured = FEATURED.map((id) => zones.find((zone) => zone.id === id)).filter(
    (zone): zone is Zone => Boolean(zone),
  );

  return (
    <section className="shell py-24">
      <SectionHeading
        eyebrow="Signature experiences"
        title="Three rooms you will not find elsewhere in Powai"
        sub="Every zone is good. These three are the reason people travel across the city for an evening here."
      />

      <div className="mt-16 flex flex-col gap-20">
        {featured.map((zone, index) => {
          const pitch = PITCH[zone.id];
          const flipped = index % 2 === 1;

          return (
            <Reveal key={zone.id} stagger="[data-feature-part]">
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div data-feature-part className={flipped ? 'lg:order-2' : undefined}>
                  <ZoneVisual
                    accent={zone.accent_hex}
                    src={zoneImage(zone)}
                    alt={`${zone.name} at GameOn Powai`}
                    className="aspect-[16/10] rounded-card border border-border"
                  />
                </div>

                <div data-feature-part className="flex flex-col gap-5">
                  <p className="eyebrow">{zone.name}</p>
                  <h3 className="max-w-[22ch] text-h2">{pitch.heading}</h3>
                  <p className="max-w-prose text-body text-muted-foreground text-pretty">
                    {pitch.body}
                  </p>

                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {pitch.detail.map((item) => (
                      <li key={item} className="text-meta text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-5 pt-2">
                    <Button asChild variant="outline">
                      <Link href={`/book?zone=${zone.id}`}>Reserve this zone</Link>
                    </Button>
                    <Link
                      href={`/zones/${zone.id}`}
                      className="inline-flex items-center gap-1.5 rounded-button text-meta text-muted-foreground transition-colors hover:text-cyan"
                    >
                      What is inside
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    <span className="font-mono text-data text-muted-foreground">
                      {inr(zone.price_per_hour)}/hour
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
