import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BookingWizard } from '@/components/booking-wizard';
import { withDb } from '@/lib/bootstrap';
import { databaseConfigured, getZones } from '@/lib/db';
import { SITE } from '@/lib/site';
import { zoneName } from '@/lib/data/club';

export { dynamic } from '@/lib/render-mode';

export const metadata: Metadata = {
  title: 'Book a session',
  description:
    'Reserve a zone at GameOn in four steps: pick a zone, a date, a time, and leave your name.',
};

export default async function BookPage() {
  if (!databaseConfigured())
    return (
      <div className="section">
        <div className="wrap max-w-[760px]">
          <div className="eyebrow">Reservations</div>
          <h1 className="mt-4">Let&apos;s get you playing</h1>
          <p className="sub mt-6">
            Online reservations will be available soon. Contact us and we will help you
            book a session.
          </p>
          <a href={SITE.whatsappUrl} className="btn btn--primary mt-8">
            Book on WhatsApp
          </a>
        </div>
      </div>
    );
  const zones = (await withDb(async () => await getZones())).map((zone) => ({
    ...zone,
    name: zoneName(zone.id, zone.name),
  }));

  return (
    <div className="section section--tight">
      <div className="wrap max-w-[1000px]">
        <header className="section-head">
          <div className="eyebrow">Reserve a slot</div>
          <h1>Lock in your playtime.</h1>
          <p className="sub">
            Four steps, about a minute. Hold a rig for an hour; extend at the counter if
            the floor is free.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-64 w-full" />
            </div>
          }
        >
          <BookingWizard zones={zones} />
        </Suspense>
      </div>
    </div>
  );
}
