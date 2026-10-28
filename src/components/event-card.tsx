import { CalendarDays, Trophy, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GameEvent } from '@/lib/types';
import { cn, fromDateKey, inr } from '@/lib/utils';

const CATEGORY_LABEL: Record<GameEvent['category'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  corporate: 'Corporate',
};

export function EventCard({
  event,
  past = false,
  className,
}: {
  event: GameEvent;
  past?: boolean;
  className?: string;
}) {
  const date = fromDateKey(event.date);
  const filled = Math.min(100, Math.round((event.registered / event.slots) * 100));
  const left = Math.max(0, event.slots - event.registered);

  return (
    <article
      className={cn(
        'flex flex-col gap-5 rounded-card border border-border bg-surface p-6 transition-colors',
        past ? 'opacity-70' : 'hover:border-cyan/40',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col items-center rounded-button border border-border bg-elevated px-3 py-2">
          <span className="font-mono text-data leading-none text-cyan">
            {date.getDate().toString().padStart(2, '0')}
          </span>
          <span className="mt-1 text-[0.6875rem] text-muted-foreground">
            {date.toLocaleString('en-IN', { month: 'short' })}
          </span>
        </div>
        <Badge variant={event.category === 'corporate' ? 'warm' : 'neutral'}>
          {CATEGORY_LABEL[event.category]}
        </Badge>
      </div>

      <div>
        <h3 className="font-display text-h3 leading-tight">{event.title}</h3>
        <p className="mt-1.5 text-meta text-muted-foreground">{event.game}</p>
      </div>

      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-meta">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-muted-foreground" />
          <dd className="text-muted-foreground">
            {date.toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </dd>
        </div>
        {event.prize_pool > 0 ? (
          <div className="flex items-center gap-1.5">
            <Trophy className="size-3.5 text-ember" />
            <dd className="font-mono text-foreground">{inr(event.prize_pool)}</dd>
          </div>
        ) : null}
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 text-muted-foreground" />
          <dd className="text-muted-foreground">
            {event.registered} of {event.slots} in
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-elevated"
          role="progressbar"
          aria-valuenow={filled}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${event.title} registration`}
        >
          <div
            className={cn('h-full rounded-full', filled > 85 ? 'bg-ember' : 'bg-cyan')}
            style={{ width: `${filled}%` }}
          />
        </div>
        <p className="text-meta text-muted-foreground">
          {past
            ? 'Finished'
            : left === 0
              ? 'Waitlist only'
              : `${left} ${left === 1 ? 'place' : 'places'} left`}
        </p>
      </div>

      {past ? null : (
        <Button variant={left === 0 ? 'secondary' : 'outline'} className="w-full" asChild>
          <a
            href={`https://wa.me/912249607890?text=${encodeURIComponent(
              `I want to register for ${event.title} on ${event.date}`,
            )}`}
          >
            {left === 0 ? 'Join the waitlist' : 'Register'}
          </a>
        </Button>
      )}
    </article>
  );
}
