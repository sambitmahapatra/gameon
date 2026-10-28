'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import type { GameEvent } from '@/lib/types';
import { cn, toDateKey } from '@/lib/utils';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'corporate', label: 'Corporate' },
] as const;

export function EventsBrowser({ events }: { events: GameEvent[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [showPast, setShowPast] = useState(false);

  const today = toDateKey(new Date());
  const matches = (event: GameEvent) => filter === 'all' || event.category === filter;

  const upcoming = events.filter((event) => event.date >= today && matches(event));
  const past = events.filter((event) => event.date < today && matches(event));

  return (
    <div className="flex flex-col gap-10">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto"
        role="group"
        aria-label="Filter events"
      >
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-meta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep',
              filter === option.id
                ? 'border-cyan bg-cyan/10 text-cyan'
                : 'border-border text-muted-foreground hover:border-cyan/40 hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {upcoming.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-border px-6 py-12 text-center">
          <p className="text-body">Nothing scheduled in this bracket yet.</p>
          <p className="mt-1.5 text-meta text-muted-foreground">
            Weekly ladders are announced every Monday on Instagram.
          </p>
        </div>
      )}

      {past.length ? (
        <div className="flex flex-col gap-6 border-t border-border pt-10">
          <Button
            variant="ghost"
            className="-ml-3 self-start"
            onClick={() => setShowPast((open) => !open)}
            aria-expanded={showPast}
          >
            <ChevronDown
              className={cn('size-4 transition-transform', showPast && 'rotate-180')}
            />
            {showPast ? 'Hide past events' : `Past events (${past.length})`}
          </Button>

          {showPast ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
