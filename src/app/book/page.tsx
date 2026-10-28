import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BookingWizard } from '@/components/booking-wizard';
import { Skeleton } from '@/components/ui/skeleton';
import { withDb } from '@/lib/bootstrap';
import { getZones } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book a session',
  description:
    'Reserve a zone at GameOn Powai in four steps: pick a zone, a date, a time, and leave your name.',
};

export default function BookPage() {
  const zones = withDb(() => getZones());

  return (
    <div className="shell max-w-4xl py-16">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Reserve a slot</p>
        <h1 className="text-h1">Book a session</h1>
        <p className="max-w-prose text-body text-muted-foreground">
          Four steps, about a minute. Hold a rig for an hour; extend at the counter if the
          floor is free.
        </p>
      </header>

      <div className="mt-12">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <BookingWizard zones={zones} />
        </Suspense>
      </div>
    </div>
  );
}
