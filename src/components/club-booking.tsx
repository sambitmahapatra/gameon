'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import type { Slot, Zone } from '@/lib/types';
import { bookingInputSchema } from '@/lib/validation';
import { api, apiBase, inrDigits, prettyTime, toDateKey } from '@/lib/utils';
import { zoneName } from '@/lib/data/club';

export function ClubBooking({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [zoneId, setZoneId] = useState(
    zones.find((z) => z.id === 'console-lounge')?.id ?? zones[0]?.id ?? '',
  );
  const [date, setDate] = useState(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return toDateKey(day);
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [reload, setReload] = useState(0);
  const zone = zones.find((z) => z.id === zoneId);
  const today = toDateKey(new Date());
  const last = new Date();
  last.setDate(last.getDate() + 29);

  useEffect(() => {
    const controller = new AbortController();
    setSlotId('');
    setSlots([]);
    setLoading(true);
    async function load() {
      try {
        const response = await fetch(
          api(
            `/api/slots?zoneId=${encodeURIComponent(zoneId)}&date=${encodeURIComponent(date)}`,
          ),
          { signal: controller.signal, cache: 'no-store' },
        );
        if (!response.ok)
          throw new Error(
            'Availability is temporarily unavailable. Try again or use the full booking page.',
          );
        const data = (await response.json()) as { slots: Slot[] };
        if (!controller.signal.aborted) setSlots(data.slots);
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : 'Could not load availability.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    if (zoneId && date) void load();
    else setLoading(false);
    return () => controller.abort();
  }, [zoneId, date, reload]);

  const available = slots.filter(
    (s) =>
      !s.booked && (date !== today || Number(s.time.slice(0, 2)) > new Date().getHours()),
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const data = new FormData(event.currentTarget);
    const result = bookingInputSchema.safeParse({
      zoneId,
      slotId,
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email') ?? '',
      partySize: data.get('partySize'),
    });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setPending(true);
    try {
      const response = await fetch(api('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      const body = (await response.json()) as {
        booking?: { id: string };
        error?: string;
      };
      if (response.status === 409) {
        setReload((n) => n + 1);
        throw new Error('That time was just taken. Choose another available slot.');
      }
      if (!response.ok || !body.booking)
        throw new Error(
          body.error ?? 'We could not confirm your booking. Please try again.',
        );
      const path = `/book/confirm/${body.booking.id}`;
      if (apiBase) window.location.assign(api(path));
      else router.push(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not connect. Please try again.');
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      className="club-booking-form"
      onSubmit={submit}
      aria-label="Book your gaming session"
      aria-busy={pending}
    >
      <div className="club-form-top">
        <span className="club-dot" />
        <span>Live availability · Pay at the counter</span>
      </div>
      <div className="club-field club-field--full">
        <label htmlFor="club-zone">Choose your experience</label>
        <select
          id="club-zone"
          value={zoneId}
          onChange={(e) => {
            setError('');
            setZoneId(e.target.value);
          }}
          disabled={pending}
          required
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {zoneName(z.id, z.name)} · ₹{inrDigits(z.price_per_hour)}/hr
            </option>
          ))}
        </select>
      </div>
      <div className="club-field">
        <label htmlFor="club-date">Your date</label>
        <input
          id="club-date"
          type="date"
          value={date}
          min={today}
          max={toDateKey(last)}
          onChange={(e) => {
            setError('');
            setDate(e.target.value);
          }}
          disabled={pending}
          required
        />
      </div>
      <div className="club-field">
        <label htmlFor="club-time">Your time</label>
        <select
          id="club-time"
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
          disabled={loading || pending || available.length === 0}
          required
        >
          <option value="">
            {loading
              ? 'Checking the floor…'
              : available.length
                ? 'Select a free slot'
                : 'No available times'}
          </option>
          {available.map((s) => (
            <option key={s.id} value={s.id}>
              {prettyTime(s.time)} · 1 hour
            </option>
          ))}
        </select>
      </div>
      <div className="club-field">
        <label htmlFor="club-name">Your name</label>
        <input
          id="club-name"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={60}
          placeholder="Player name"
          disabled={pending}
          required
        />
      </div>
      <div className="club-field">
        <label htmlFor="club-phone">Mobile number</label>
        <input
          id="club-phone"
          name="phone"
          type="tel"
          autoComplete="tel-national"
          inputMode="tel"
          placeholder="10-digit mobile"
          disabled={pending}
          required
        />
      </div>
      <div className="club-field">
        <label htmlFor="club-players">Players</label>
        <select
          key={zoneId}
          id="club-players"
          name="partySize"
          defaultValue="1"
          disabled={pending}
        >
          {Array.from({ length: Math.min(zone?.capacity ?? 1, 10) }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i ? 'players' : 'player'}
            </option>
          ))}
        </select>
      </div>
      <div className="club-field">
        <label htmlFor="club-email">
          Email <span>(optional)</span>
        </label>
        <input
          id="club-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={pending}
        />
      </div>
      <div className="club-form-total">
        <span>One-hour session</span>
        <strong>₹{inrDigits(zone?.price_per_hour ?? 0)}</strong>
      </div>
      {error && (
        <p role="alert" className="club-form-error">
          {error}
        </p>
      )}
      {!loading && !error && !available.length && (
        <p className="club-form-error" role="status">
          This day is fully booked. Try another date or zone.
        </p>
      )}
      <button
        className="club-btn club-btn--ink"
        type="submit"
        disabled={pending || loading || !slotId}
      >
        {pending ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Confirming your session…
          </>
        ) : (
          <>
            Lock in my session <ArrowUpRight size={17} />
          </>
        )}
      </button>
      <p className="club-form-note">
        Instant confirmation with your check-in QR. No online payment.
      </p>
    </form>
  );
}
