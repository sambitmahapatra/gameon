import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { BookingsTable } from '@/components/admin/bookings-table';
import { Price } from '@/components/price';
import { withDb } from '@/lib/bootstrap';
import { getAdminStats, getZones, listBookings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Floor dashboard',
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: { key?: string } };

/**
 * Demo gate, deliberately simple: a shared key in the query string (spec 4.1).
 * Anything production-facing needs real auth before this page goes public.
 */
export default function AdminPage({ searchParams }: PageProps) {
  const expected = process.env.ADMIN_KEY ?? 'gameon-demo';

  if (searchParams.key !== expected) {
    return (
      <div className="shell flex max-w-xl flex-col gap-4 py-24">
        <p className="eyebrow">Staff only</p>
        <h1 className="text-h1">Floor dashboard</h1>
        <p className="text-body text-muted-foreground">
          Open this page with the staff key appended, for example{' '}
          <span className="font-mono text-foreground">/admin?key=…</span>. The key lives
          in
          <span className="font-mono text-foreground"> ADMIN_KEY</span>, and the demo
          default is in <span className="font-mono text-foreground">.env.example</span>.
        </p>
      </div>
    );
  }

  const { stats, bookings, zones } = withDb(() => ({
    stats: getAdminStats(),
    bookings: listBookings(),
    zones: getZones(),
  }));

  const cards: { label: string; value: ReactNode }[] = [
    { label: 'Bookings today', value: String(stats.todayBookings) },
    {
      label: 'Revenue booked this week',
      value: <Price amount={stats.weekRevenue} />,
    },
    { label: 'Occupancy, next 7 days', value: `${stats.occupancy7d}%` },
    { label: 'Members on file', value: String(stats.activeMembers) },
  ];

  return (
    <div className="shell py-16">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">Staff view</p>
        <h1 className="text-h1">Floor dashboard</h1>
        <p className="max-w-prose text-meta text-muted-foreground">
          Live from the booking database. Cancelling here frees the slot straight away, so
          the website can resell it.
        </p>
      </header>

      <dl className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="panel flex flex-col gap-2 p-6">
            <dd className="font-mono text-h2 font-bold text-cyan">{card.value}</dd>
            <dt className="text-meta text-muted-foreground">{card.label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-16">
        <h2 className="text-h2">Bookings</h2>
        <div className="mt-8">
          <BookingsTable bookings={bookings} zones={zones} adminKey={expected} />
        </div>
      </section>
    </div>
  );
}
