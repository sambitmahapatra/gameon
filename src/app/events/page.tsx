import type { Metadata } from 'next';

import { EventsBrowser } from '@/components/events-browser';
import { withDb } from '@/lib/bootstrap';
import { listEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tournaments and events',
  description:
    'Weekly ladders, monthly cups with real prize pools, and corporate nights at GameOn Powai.',
};

export default function EventsPage() {
  const events = withDb(() => listEvents());

  return (
    <div className="shell py-16">
      <header className="flex max-w-prose flex-col gap-4">
        <p className="eyebrow">Competitive calendar</p>
        <h1 className="text-h1">Tournaments and events in Powai</h1>
        <p className="text-body text-muted-foreground">
          Register at the counter, on WhatsApp, or here. Entry is free for Gold members and
          discounted for Silver.
        </p>
      </header>

      <div className="mt-12">
        <EventsBrowser events={events} />
      </div>
    </div>
  );
}
