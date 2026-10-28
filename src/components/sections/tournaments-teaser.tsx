import Link from 'next/link';

import { EventCard } from '@/components/event-card';
import { Reveal } from '@/components/motion/reveal';
import type { GameEvent } from '@/lib/types';

/** Three upcoming tournaments, with the calendar link on the right. */
export function TournamentsTeaser({ events }: { events: GameEvent[] }) {
  if (!events.length) return null;

  return (
    <section className="section section--elevated" id="events">
      <div className="wrap">
        <Reveal className="events-head">
          <div>
            <div className="eyebrow">Tournaments</div>
            <h2 className="mt-5">Something is on almost every night</h2>
          </div>
          <Link href="/events" className="feature__cta">
            See the full calendar
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <Reveal className="events-grid" stagger=".event">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
