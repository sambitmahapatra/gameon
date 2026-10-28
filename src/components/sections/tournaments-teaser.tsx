import Link from 'next/link';

import { EventCard } from '@/components/event-card';
import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from '@/components/section-heading';
import type { GameEvent } from '@/lib/types';

export function TournamentsTeaser({ events }: { events: GameEvent[] }) {
  const upcoming = events.slice(0, 3);
  if (!upcoming.length) return null;

  return (
    <section className="shell py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Tournaments"
          title="Something is on almost every night"
          sub="Weekly ladders for the regulars, monthly cups with real prize pools, and corporate nights when an office takes over the floor."
        />
        <Link
          href="/events"
          className="rounded-button text-meta text-cyan underline-offset-4 hover:underline"
        >
          See all events
        </Link>
      </div>

      <Reveal stagger="[data-event]" className="mt-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <div key={event.id} data-event>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
