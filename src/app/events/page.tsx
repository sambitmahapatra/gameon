import type { Metadata } from 'next';

import { EventsBrowser } from '@/components/events-browser';
import { getPublicEvents } from '@/lib/public-data';

export { dynamic } from '@/lib/render-mode';

export const metadata: Metadata = {
  title: 'Tournaments and events',
  description:
    'Weekly ladders, monthly cups with real prize pools, and corporate nights at GameOn.',
};

export default async function EventsPage() {
  const events = await getPublicEvents();

  return (
    <div className="section section--tight">
      <div className="wrap">
        <header className="section-head">
          <div className="eyebrow">Competitive calendar</div>
          <h1>Something is on almost every night</h1>
          <p className="sub">
            Register at the counter, on WhatsApp, or here. Entry is free for Gold members
            and discounted for Silver.
          </p>
        </header>

        <EventsBrowser events={events} />
      </div>
    </div>
  );
}
