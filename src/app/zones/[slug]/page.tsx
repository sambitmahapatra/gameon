import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Gamepad2, Users, Zap } from 'lucide-react';

import { Reveal } from '@/components/motion/reveal';
import { ZoneArt } from '@/components/zone-art';
import { BrandPhoto } from '@/components/brand-photo';
import { ZoneCard } from '@/components/zone-card';
import { ZoneGallery } from '@/components/zone-gallery';
import { getPublicZone, getPublicZones } from '@/lib/public-data';
import { ZONE_SEED } from '@/lib/data/venue';
import { inrDigits } from '@/lib/utils';

export { dynamic } from '@/lib/render-mode';

type PageProps = { params: { slug: string } };

/** Emitted for the static export; the server build renders on demand. */
export async function generateStaticParams() {
  return ZONE_SEED.map((zone) => ({ slug: zone.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const zone = await getPublicZone(params.slug);
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

export default async function ZonePage({ params }: PageProps) {
  const others = await getPublicZones();
  const zone = others.find((candidate) => candidate.id === params.slug);

  if (!zone) notFound();

  const specs = SPECS[zone.id] ?? { games: [], durations: [], kit: [] };
  const siblings = others.filter((candidate) => candidate.id !== zone.id);

  // The seed copy is one dense block; split it in two so "The room" reads as
  // prose rather than a wall.
  const sentences = zone.description.split(/(?<=\.)\s+/);
  const half = Math.ceil(sentences.length / 2);
  const paragraphs = [
    sentences.slice(0, half).join(' '),
    sentences.slice(half).join(' '),
  ].filter(Boolean);

  return (
    <article>
      {/* full-bleed 2:1 hero in the zone's own art */}
      <div className="wrap pt-8">
        <div className="feature__art !aspect-[2/1]">
          <BrandPhoto
            src={`/images/zones/${zone.id}.webp`}
            alt={`${zone.name} zone at GameOn`}
            width={1920}
            height={1080}
            sizes="100vw"
            priority
            overlay
            fallback={<ZoneArt slug={zone.id} uid={`zh-${zone.id}`} />}
          />
        </div>
      </div>

      <div className="wrap mt-14 grid gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
        <div className="flex flex-col gap-6">
          <div className="eyebrow">{zone.tagline}</div>
          <h1>{zone.name}</h1>

          <section aria-labelledby="the-room" className="flex flex-col gap-4">
            <h2 id="the-room" className="sr-only">
              The room
            </h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="sub">
                {paragraph}
              </p>
            ))}
          </section>

          <div className="mt-2 flex flex-wrap gap-3">
            <Link href={`/book?zone=${zone.id}`} className="btn btn--primary btn--lg">
              Reserve this zone
            </Link>
            <Link href="/membership" className="btn btn--ghost btn--lg">
              See membership rates
            </Link>
          </div>

          <section aria-labelledby="whats-on" className="mt-10 flex flex-col gap-5">
            <h2 id="whats-on">What is on</h2>
            <Reveal className="flex flex-wrap gap-2.5" stagger=".chip">
              {specs.games.map((game) => (
                <span key={game} className="chip">
                  {game}
                </span>
              ))}
            </Reveal>
            <p className="max-w-prose text-meta text-fg-muted">
              Ask at the counter if you want something installed. If it runs on our
              hardware and we can license it, we will add it before your next visit.
            </p>
          </section>

          <section aria-labelledby="gallery" className="mt-10 flex flex-col gap-5">
            <h2 id="gallery">The room</h2>
            <ZoneGallery slug={zone.id} name={zone.name} />
          </section>
        </div>

        <aside className="panel h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-h3">Specs</h2>
          <dl className="mt-5 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Users aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <dt className="text-meta text-fg-muted">Capacity</dt>
                <dd className="mono text-fg">up to {zone.capacity} players</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gamepad2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-brand"
              />
              <div>
                <dt className="text-meta text-fg-muted">Rate</dt>
                <dd className="mono text-fg">
                  ₹{inrDigits(zone.price_per_hour)} an hour
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <dt className="text-meta text-fg-muted">Session lengths</dt>
                <dd className="mono text-fg">{specs.durations.join(' · ')}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              <div>
                <dt className="text-meta text-fg-muted">What is included</dt>
                <dd className="text-meta text-fg">{specs.kit.join(', ')}</dd>
              </div>
            </div>
          </dl>
        </aside>
      </div>

      <section aria-labelledby="other-zones" className="section">
        <div className="wrap">
          <h2 id="other-zones" className="mb-8">
            The other five
          </h2>
          <div className="zones-grid">
            {siblings.map((sibling) => (
              <ZoneCard
                key={sibling.id}
                zone={sibling}
                uid={`zs-${sibling.id}`}
                href={`/zones/${sibling.id}`}
              />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
