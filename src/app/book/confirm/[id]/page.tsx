import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';

import { BookingTimeline } from '@/components/booking-timeline';
import { ConfirmActions } from '@/components/confirm-actions';
import { Confetti } from '@/components/confetti';
import { QrReveal } from '@/components/qr-reveal';
import { WordReveal } from '@/components/word-reveal';
import { withDb } from '@/lib/bootstrap';
import { getBooking } from '@/lib/db';
import { SITE } from '@/lib/site';
import { zoneName } from '@/lib/data/club';
import { fromDateKey, inrDigits, prettyTime } from '@/lib/utils';

export { dynamic } from '@/lib/render-mode';

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

export default async function ConfirmPage({ params }: PageProps) {
  const booking = await withDb(async () => await getBooking(params.id));
  if (!booking) notFound();

  const cancelled = booking.status === 'cancelled';

  // The matrix, not a rendered SVG string: the client component animates the
  // modules in, and currentColor keeps the code legible in both themes.
  const matrix = QRCode.create(booking.id, { errorCorrectionLevel: 'M' }).modules;

  const date = fromDateKey(booking.date);
  const longDate = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="section section--tight">
      {cancelled ? null : <Confetti />}

      <div className="wrap max-w-[1000px]">
        <header className="section-head">
          <div className="eyebrow">{cancelled ? 'Cancelled' : 'Confirmed'}</div>
          <h1>{cancelled ? 'This one is off.' : <WordReveal text="You're in." />}</h1>
          <p className="sub">
            {cancelled
              ? 'The slot went back on the floor. Book another whenever you are ready.'
              : 'We have reserved your rig. Show this code at the counter and the staff will walk you over.'}
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-5">
            <div className="panel bg-white p-5 text-black">
              <QrReveal
                bits={Array.from(matrix.data)}
                size={matrix.size}
                label={`QR code for booking ${booking.id}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="mono text-fg-dim">Booking ID</span>
              <span className="font-mono text-[1.6rem] font-medium tracking-tight text-brand">
                {booking.id}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <dl className="panel px-6 py-2">
              {[
                ['Zone', zoneName(booking.zone_id, booking.zone_name)],
                ['Date', longDate],
                ['Time', `${prettyTime(booking.time)} for one hour`],
                ['Party size', `${booking.party_size} players`],
                ['Name', booking.name],
                ['Mobile', booking.phone],
              ].map(([label, value]) => (
                <div key={label} className="meta-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div className="meta-row">
                <dt>Due at the counter</dt>
                <dd className="mono">₹{inrDigits(booking.price_per_hour)}</dd>
              </div>
            </dl>

            {cancelled ? (
              <Link href="/book" className="btn btn--primary btn--lg self-start">
                Book another session
              </Link>
            ) : (
              <ConfirmActions
                id={booking.id}
                zoneName={zoneName(booking.zone_id, booking.zone_name)}
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
            <section
              aria-labelledby="timeline-heading"
              className="mt-20 flex flex-col gap-8 border-t border-line pt-16"
            >
              <h2 id="timeline-heading">What happens next</h2>
              <BookingTimeline active={0} />
            </section>

            <section
              aria-labelledby="bring-heading"
              className="mt-20 flex flex-col gap-6 border-t border-line pt-16"
            >
              <h2 id="bring-heading">What to bring</h2>
              <ul className="flex max-w-prose flex-col gap-3">
                {BRING.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-brand"
                    />
                    <span className="text-fg-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-meta text-fg-dim">
                We are at {SITE.address}. Parking is free for the first two hours.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
