'use client';

import { useEffect, useRef, useState } from 'react';

import { EventRegisterButton } from '@/components/event-register-button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { GameEvent } from '@/lib/types';
import { fromDateKey, inrDigits } from '@/lib/utils';

const CATEGORY_LABEL: Record<GameEvent['category'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly cup',
  corporate: 'Corporate',
};

const CATEGORY_CLASS: Record<GameEvent['category'], string> = {
  weekly: '',
  monthly: ' event__tag--magenta',
  corporate: ' event__tag--violet',
};

/**
 * Tournament card. The fill bar grows from nothing to its real width the
 * first time the card is seen (V3 §5.5); the width itself is the true value,
 * so if the observer never runs the bar is already correct.
 */
export function EventCard({ event, past = false }: { event: GameEvent; past?: boolean }) {
  const date = fromDateKey(event.date);
  const pct = Math.min(100, Math.round((event.registered / event.slots) * 100));
  const full = event.registered >= event.slots;

  const bar = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = bar.current;
    if (reduced || !node || seen) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setSeen(true);
        observer.disconnect();
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, seen]);

  const dateLabel = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <article className={`event${past ? 'event--past' : ''}`}>
      <div className="event__top">
        <div className="event__date">
          <span className="d">{String(date.getDate()).padStart(2, '0')}</span>
          <span className="m">
            {date.toLocaleDateString('en-IN', { month: 'short' })}
          </span>
        </div>
        <span className={`event__tag${CATEGORY_CLASS[event.category]}`}>
          {CATEGORY_LABEL[event.category]}
        </span>
      </div>

      <h3 className="event__title">{event.title}</h3>
      <div className="event__game">{event.game}</div>

      <div
        className="event__fill"
        role="img"
        aria-label={`${event.registered} of ${event.slots} places taken`}
      >
        <span
          ref={bar}
          style={{
            width: `${pct}%`,
            transform: reduced || seen ? undefined : 'scaleX(0)',
            transition: reduced
              ? undefined
              : 'transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        />
      </div>

      <div className="event__meta">
        <span>₹{inrDigits(event.prize_pool)} pool</span>
        <span>
          <b>{event.registered}</b> of {event.slots} in
        </span>
      </div>

      {past ? (
        <span className="event__btn" aria-disabled="true">
          Finished
        </span>
      ) : (
        <EventRegisterButton
          eventId={event.id}
          title={event.title}
          date={dateLabel}
          full={full}
        />
      )}
    </article>
  );
}
