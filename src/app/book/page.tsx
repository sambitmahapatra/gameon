import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BookingWizard } from '@/components/booking-wizard';
import { withDb } from '@/lib/bootstrap';
import { getZones } from '@/lib/db';

export { dynamic } from '@/lib/render-mode';

export const metadata: Metadata = {
  title: 'Book a session',
  description:
    'Reserve a zone at GameOn in four steps: pick a zone, a date, a time, and leave your name.',
};

export default function BookPage() {
  const zones = withDb(() => getZones());

  return (
    <div className="section section--tight">
      <div className="wrap max-w-[1000px]">
        <header className="section-head">
          <div className="eyebrow">Reserve a slot</div>
          <h1>Book a session</h1>
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
