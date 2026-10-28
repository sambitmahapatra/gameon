import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Gamepad2, Users, Zap } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { ZoneCard } from '@/components/zone-card';
import { ZoneVisual } from '@/components/zone-visual';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { withDb } from '@/lib/bootstrap';
import { getZone, getZones } from '@/lib/db';
import { inr } from '@/lib/utils';
import { zoneImage } from '@/lib/zone-images';

export { dynamic } from '@/lib/render-mode';

type PageProps = { params: { slug: string } };

/** Emitted for the static export; the server build renders on demand. */
export function generateStaticParams() {
  return withDb(() => getZones()).map((zone) => ({ slug: zone.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const zone = withDb(() => getZone(params.slug));
  if (!zone) return { title: 'Zone not found' };

  return {
    title: zone.name,
    description: `${zone.tagline}. ${zone.description.slice(0, 120)}`,
  };
}

const SPECS: Record<string, { games: string[]; durations: string[]; kit: string[] }> = {
  'vr-arena': {
    games: ['Arizona Sunshine 2', 'After the Fall', 'Escape rooms', 'Creative sandbox'],
    durations: ['30 minutes', '1 hour', '90 minutes'],
    kit: ['Wireless headsets', 'Body tracking', 'Free-roam floor', 'Spotter on duty'],
  },
  'flight-sim': {
    games: ['MSFS 2024', 'X-Plane 12', 'Guided first circuit'],
    durations: ['45 minutes with briefing', '1 hour', '2 hours'],
    kit: [
      'Cockpit replica',
      'Yoke and rudder pedals',
      'Three curved screens',
      'Headset comms',
    ],
  },
  'racing-cockpit': {
    games: ['Assetto Corsa Competizione', 'F1 25', 'Gran Turismo 7', 'Rally'],
    durations: ['30 minutes', '1 hour', '2 hours'],
    kit: ['Motion rig', 'Direct-drive wheel', 'Load-cell pedals', 'Live timing screens'],
  },
  'esports-station': {
    games: ['Valorant', 'CS2', 'Dota 2', 'BGMI', 'Apex Legends'],
    durations: ['1 hour', '3-hour block', 'Full day'],
    kit: ['RTX 4080', '240Hz panel', 'Swappable keyboards', '1 Gbps line'],
  },
  'console-lounge': {
    games: ['EA Sports FC 26', 'Tekken 8', 'Mario Kart', 'Party games'],
    durations: ['1 hour', '2 hours', '3 hours'],
    kit: ['PS5', 'Xbox Series X', 'Switch', '65-inch OLED'],
  },
  'streaming-pod': {
    games: ['Your own library', 'Podcast mode', 'Audition reels'],
    durations: ['1 hour', '2 hours', '4-hour block'],
    kit: ['Condenser mic', 'Two cameras', 'Key and fill lights', 'OBS scenes ready'],
  },
};

export default function ZonePage({ params }: PageProps) {
  const { zone, others } = withDb(() => ({
    zone: getZone(params.slug),
    others: getZones(),
  }));

  if (!zone) notFound();

  const specs = SPECS[zone.id] ?? { games: [], durations: [], kit: [] };
  const image = zoneImage(zone);
  const siblings = others.filter((candidate) => candidate.id !== zone.id).slice(0, 3);

  return (
    <article className="pb-16">
      <div className="shell pt-10">
        <ZoneVisual
          accent={zone.accent_hex}
          src={image}
          alt={`${zone.name} at GameOn Powai`}
          priority
          className="aspect-[16/9] rounded-card border border-border md:aspect-[21/9]"
        />
      </div>

      <div className="shell mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div className="flex flex-col gap-6">
          <p className="eyebrow">{zone.tagline}</p>
          <h1 className="text-h1">{zone.name}</h1>
          <p className="max-w-prose text-pretty text-body text-muted-foreground">
            {zone.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg">
              <Link href={`/book?zone=${zone.id}`}>Reserve this zone</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/menu">See the café menu</Link>
            </Button>
          </div>

          <Separator className="my-6" />

          <section aria-labelledby="whats-inside" className="flex flex-col gap-6">
            <h2 id="whats-inside" className="text-h2">
              What is inside
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {specs.kit.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 text-meta"
                >
                  <Zap className="size-3.5 shrink-0 text-cyan" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="whats-on" className="mt-6 flex flex-col gap-5">
            <h2 id="whats-on" className="text-h2">
              What you can play
            </h2>
            <ul className="flex flex-wrap gap-2">
              {specs.games.map((game) => (
                <li
                  key={game}
                  className="rounded-full border border-border px-3.5 py-1.5 text-meta text-muted-foreground"
                >
                  {game}
                </li>
              ))}
            </ul>
            <p className="max-w-prose text-meta text-muted-foreground">
              Ask at the counter if you want something installed. If it runs on our
              hardware and we can license it, we will add it before your next visit.
            </p>
          </section>

          {/* Gallery: placeholder tiles until the generated artwork lands */}
          <section aria-labelledby="gallery" className="mt-10 flex flex-col gap-5">
            <h2 id="gallery" className="text-h2">
              The room
            </h2>
            <Reveal stagger="[data-gallery-tile]">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} data-gallery-tile>
                    <ZoneVisual
                      accent={zone.accent_hex}
                      src={image}
                      alt={`${zone.name}, view ${index + 1}`}
                      className="aspect-[4/3] rounded-card border border-border"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        </div>

        <aside className="flex h-fit flex-col gap-6 rounded-card border border-border bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-h3">Specs</h2>
          <dl className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-4 shrink-0 text-cyan" />
              <div>
                <dt className="text-meta text-muted-foreground">Capacity</dt>
                <dd className="font-mono text-data text-foreground">
                  up to {zone.capacity} players
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gamepad2 className="mt-0.5 size-4 shrink-0 text-cyan" />
              <div>
                <dt className="text-meta text-muted-foreground">Rate</dt>
                <dd className="font-mono text-data text-foreground">
                  {inr(zone.price_per_hour)} an hour
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-cyan" />
              <div>
                <dt className="text-meta text-muted-foreground">Session lengths</dt>
                <dd className="text-meta text-foreground">
                  {specs.durations.join(' · ')}
                </dd>
              </div>
            </div>
          </dl>
          <Separator />
          <p className="text-meta text-muted-foreground">
            Members pay from 10% to 30% less, and can hold peak slots two days before
            everyone else.
          </p>
          <Button asChild variant="secondary">
            <Link href="/membership">See membership</Link>
          </Button>
        </aside>
      </div>

      <section className="shell mt-24">
        <h2 className="text-h2">Other zones</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {siblings.map((sibling) => (
            <ZoneCard key={sibling.id} zone={sibling} />
          ))}
        </div>
      </section>
    </article>
  );
}
