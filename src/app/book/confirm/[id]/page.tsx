import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';

import { BookingTimeline } from '@/components/booking-timeline';
import { ConfirmActions } from '@/components/confirm-actions';
import { QrReveal } from '@/components/qr-reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { withDb } from '@/lib/bootstrap';
import { getBooking, listBookings } from '@/lib/db';
import { isStaticExport } from '@/lib/render-mode';
import { SITE } from '@/lib/site';
import { fromDateKey, inr, prettyTime } from '@/lib/utils';

export { dynamic } from '@/lib/render-mode';

type PageProps = { params: { id: string } };

/**
 * Only the static export needs these. It can only emit pages for bookings that
 * already exist at build time, which is why the APK points its WebView at the
 * hosted site (see capacitor.config.ts) rather than shipping the export alone.
 */
export function generateStaticParams() {
  if (!isStaticExport) return [];
  return withDb(() => listBookings({ status: 'confirmed', limit: 50 })).map(
    (booking) => ({
      id: booking.id,
    }),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `Booking ${params.id}`,
    description: 'Your GameOn reservation, with the QR code for the counter.',
    robots: { index: false },
  };
}

const BRING = [
  'This QR code, on your phone or printed',
  'A government ID if you look under 18 — the flight simulator needs 12+',
  'Your own keyboard or controller, if you prefer it to ours',
  'Socks for the VR arena',
];

export default function ConfirmPage({ params }: PageProps) {
  const booking = withDb(() => getBooking(params.id));
  if (!booking) notFound();

  const cancelled = booking.status === 'cancelled';

  // The matrix, not a rendered SVG string: the client component animates the
  // modules in, and currentColor keeps the code legible in both themes.
  const matrix = QRCode.create(booking.id, { errorCorrectionLevel: 'M' }).modules;

  const date = fromDateKey(booking.date);

  return (
    <div className="shell max-w-4xl py-16">
      <header className="flex flex-col gap-4">
        {cancelled ? (
          <Badge variant="danger">Cancelled</Badge>
        ) : (
          <Badge variant="success">Confirmed</Badge>
        )}
        <h1 className="text-h1">{cancelled ? 'This one is off' : "You're in"}</h1>
        <p className="max-w-prose text-body text-muted-foreground">
          {cancelled
            ? 'The slot went back on the floor. Book another whenever you are ready.'
            : "We've reserved your spot. Show this QR at the counter."}
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <div className="panel p-5 text-foreground">
            <QrReveal
              bits={Array.from(matrix.data)}
              size={matrix.size}
              label={`QR code for booking ${booking.id}`}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-meta text-muted-foreground">Booking ID</span>
            <span className="font-mono text-h3 tracking-tight text-cyan">
              {booking.id}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <dl className="panel divide-y divide-border px-6">
            {[
              ['Zone', booking.zone_name],
              [
                'Date',
                date.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }),
              ],
              ['Time', `${prettyTime(booking.time)} for one hour`],
              ['Party size', `${booking.party_size} players`],
              ['Name', booking.name],
              ['Mobile', booking.phone],
              ['Due at the counter', inr(booking.price_per_hour)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-meta text-muted-foreground">{label}</dt>
                <dd className="text-right text-meta text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          {cancelled ? (
            <Button asChild className="self-start">
              <Link href="/book">Book another session</Link>
            </Button>
          ) : (
            <ConfirmActions
              id={booking.id}
              zoneName={booking.zone_name}
              date={booking.date}
              time={booking.time}
              partySize={booking.party_size}
              cancelled={cancelled}
            />
          )}
        </div>
      </div>

      {cancelled ? null : (
        <>
          <Separator className="my-16" />

          <section aria-labelledby="timeline-heading" className="flex flex-col gap-6">
            <h2 id="timeline-heading" className="text-h2">
              What happens next
            </h2>
            <BookingTimeline active={0} />
          </section>

          <Separator className="my-16" />

          <section aria-labelledby="bring-heading" className="flex flex-col gap-6">
            <h2 id="bring-heading" className="text-h2">
              What to bring
            </h2>
            <ul className="flex max-w-prose flex-col gap-3">
              {BRING.map((item) => (
                <li key={item} className="flex items-start gap-3 text-meta">
                  <span
                    aria-hidden="true"
                    className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-cyan"
                  />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-meta text-muted-foreground">
              We are at {SITE.address}. Parking is free for the first two hours.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
