import type { Metadata } from 'next';

import { BookingsTable } from '@/components/admin/bookings-table';
import { Sparkline } from '@/components/sparkline';
import { withDb } from '@/lib/bootstrap';
import { getAdminStats, getZones, listBookings } from '@/lib/db';
import { inrDigits, toDateKey } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Floor dashboard',
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: { key?: string } };

/** Keys for the last seven days, oldest first. */
function lastWeek() {
  const days: string[] = [];
  for (let back = 6; back >= 0; back -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - back);
    days.push(toDateKey(day));
  }
  return days;
}

/**
 * Demo gate, deliberately simple: a shared key in the query string (spec 4.1).
 * Anything production-facing needs real auth before this page goes public.
 */
export default async function AdminPage({ searchParams }: PageProps) {
  const expected = process.env.ADMIN_KEY ?? 'gameon-demo';

  if (searchParams.key !== expected) {
    return (
      <div className="section section--tight">
        <div className="wrap max-w-[640px]">
          <div className="eyebrow">Staff only</div>
          <h1 className="mt-4">Floor dashboard</h1>
          <p className="sub mt-4">
            Open this page with the staff key appended, for example{' '}
            <span className="mono text-fg">/admin?key=…</span>. The key lives in{' '}
            <span className="mono text-fg">ADMIN_KEY</span>, and the demo default is in{' '}
            <span className="mono text-fg">.env.example</span>.
          </p>
        </div>
      </div>
    );
  }

  const { stats, bookings, zones } = await withDb(async () => ({
    stats: await getAdminStats(),
    bookings: await listBookings(),
    zones: await getZones(),
  }));

  // Trend lines are derived here rather than in db.ts, which stays untouched.
  const week = lastWeek();
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed');
  const perDay = week.map(
    (day) => confirmed.filter((booking) => booking.date === day).length,
  );
  const revenuePerDay = week.map((day) =>
    confirmed
      .filter((booking) => booking.date === day)
      .reduce((total, booking) => total + booking.price_per_hour, 0),
  );
  const zoneSpread = zones.map(
    (zone) => confirmed.filter((booking) => booking.zone_id === zone.id).length,
  );

  const cards = [
    {
      label: 'Bookings today',
      value: String(stats.todayBookings),
      points: perDay,
      trend: 'Bookings a day, last seven days',
    },
    {
      label: 'Revenue booked this week',
      value: `₹${inrDigits(stats.weekRevenue)}`,
      points: revenuePerDay,
      trend: 'Revenue a day, last seven days',
      accent: 'var(--amber)',
    },
    {
      label: 'Occupancy, next 7 days',
      value: `${stats.occupancy7d}%`,
      points: perDay,
      trend: 'Bookings a day, last seven days',
      accent: 'var(--violet)',
    },
    {
      label: 'Members on file',
      value: String(stats.activeMembers),
      points: zoneSpread,
      trend: 'Confirmed bookings by zone',
      accent: 'var(--magenta)',
    },
  ];

  return (
    <div className="section section--tight">
      <div className="wrap">
        <header className="section-head">
          <div className="eyebrow">Staff view</div>
          <h1>Floor dashboard</h1>
          <p className="sub">
            Live from the booking database. Cancelling here frees the slot straight away,
            so the website can resell it.
          </p>
        </header>

        <dl className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="panel flex flex-col gap-3 p-6">
              <dd className="font-mono text-[2rem] font-bold leading-none tracking-tight text-fg">
                {card.value}
              </dd>
              <dt className="text-meta text-fg-muted">{card.label}</dt>
              <Sparkline points={card.points} label={card.trend} accent={card.accent} />
            </div>
          ))}
        </dl>

        <section className="mt-16">
          <h2>Bookings</h2>
          <div className="mt-8">
            <BookingsTable bookings={bookings} zones={zones} adminKey={expected} />
          </div>
        </section>
      </div>
    </div>
  );
}
