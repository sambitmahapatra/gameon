'use client';
import { cn } from '@/lib/utils';
const STAGES = [
  { label: 'Reserved', note: 'Slot held in your name' },
  { label: 'En route', note: 'Show the QR at the counter' },
  { label: 'Checked in', note: 'Staff walk you to the rig' },
];
export function BookingTimeline({ active = 0 }: { active?: number }) {
  return (
    <ol className="booking-timeline grid grid-cols-3 gap-4">
      {STAGES.map((stage, index) => (
        <li
          key={stage.label}
          aria-current={index === active ? 'step' : undefined}
          className="flex flex-col gap-2"
        >
          <span
            className={cn(
              'booking-timeline__dot',
              index <= active && 'is-complete',
              index === active && 'is-current',
            )}
            aria-hidden="true"
          />
          <span
            className={cn('text-meta', index <= active ? 'text-brand' : 'text-fg-muted')}
          >
            {stage.label}
          </span>
          <span className="text-meta text-fg-muted">{stage.note}</span>
        </li>
      ))}
    </ol>
  );
}
