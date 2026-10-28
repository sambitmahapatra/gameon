'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { EventCard } from '@/components/event-card';
import { EmptyState } from '@/components/empty-state';
import type { GameEvent } from '@/lib/types';
import { cn, toDateKey } from '@/lib/utils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'corporate', label: 'Corporate' },
] as const;

const PAGE = 6;

export function EventsBrowser({ events }: { events: GameEvent[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [showPast, setShowPast] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const today = toDateKey(new Date());
  const matches = (event: GameEvent) => filter === 'all' || event.category === filter;

  const upcoming = events.filter((event) => event.date >= today && matches(event));
  const past = events.filter((event) => event.date < today && matches(event));
  const shown = upcoming.slice(0, limit);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Filter events">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setFilter(option.id);
              setLimit(PAGE);
            }}
            aria-pressed={filter === option.id}
            data-active={filter === option.id}
            className="chip"
          >
            {option.label}
          </button>
        ))}
      </div>

      {shown.length ? (
        <div className="events-grid">
          {shown.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing scheduled in this bracket yet."
          note="Weekly ladders are announced every Monday on Instagram."
        />
      )}

      {upcoming.length > shown.length ? (
        <button
          type="button"
          className="btn btn--ghost self-start"
          onClick={() => setLimit((current) => current + PAGE)}
        >
          Load more ({upcoming.length - shown.length} to go)
        </button>
      ) : null}

      {past.length ? (
        <div className="flex flex-col gap-6 border-t border-line pt-10">
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start text-meta text-fg-muted transition-colors hover:text-fg"
            onClick={() => setShowPast((open) => !open)}
            aria-expanded={showPast}
          >
            <ChevronDown
              aria-hidden="true"
              className={cn('size-4 transition-transform', showPast && 'rotate-180')}
            />
            {showPast ? 'Hide past events' : `Past events (${past.length})`}
          </button>

          {showPast ? (
            <div className="events-grid">
              {past.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
