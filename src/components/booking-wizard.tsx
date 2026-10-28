'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

import { BookingProgress } from '@/components/booking-progress';
import { SlotPicker } from '@/components/slot-picker';
import { ZoneCard } from '@/components/zone-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import type { Slot, Zone } from '@/lib/types';
import { api, cn, inr, prettyTime, toDateKey } from '@/lib/utils';
import { type DetailsInput, detailsSchema } from '@/lib/validation';

type BookingWizardProps = { zones: Zone[] };

const LAST_DAY_OFFSET = 29; // the seed covers 30 days from today

export function BookingWizard({ zones }: BookingWizardProps) {
  const router = useRouter();
  const params = useSearchParams();

  const preselected = params.get('zone');
  const [step, setStep] = useState(preselected ? 2 : 1);
  const [zoneId, setZoneId] = useState<string | null>(
    preselected && zones.some((zone) => zone.id === preselected) ? preselected : null,
  );
  const [date, setDate] = useState<Date>(() => new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const zone = zones.find((candidate) => candidate.id === zoneId) ?? null;

  const form = useForm<DetailsInput>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { name: '', phone: '', email: undefined, partySize: 2 },
    mode: 'onTouched',
  });

  const partySize = form.watch('partySize');

  const loadSlots = useCallback(async (selectedZone: string, selectedDate: Date) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(
        api(`/api/slots?zoneId=${selectedZone}&date=${toDateKey(selectedDate)}`),
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error('slots');
      const data = (await res.json()) as { slots: Slot[] };
      setSlots(data.slots);
    } catch {
      setSlots([]);
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (!zoneId || step < 2) return;
    setSlot(null);
    loadSlots(zoneId, date);
  }, [zoneId, date, step, loadSlots]);

  // Today's slots that have already started are not bookable.
  const isToday = toDateKey(date) === toDateKey(new Date());
  const minTime = isToday
    ? `${String(new Date().getHours() + 1).padStart(2, '0')}:00`
    : null;

  const lastBookableDay = new Date();
  lastBookableDay.setDate(lastBookableDay.getDate() + LAST_DAY_OFFSET);

  function chooseZone(next: string) {
    setZoneId(next);
    setStep(2);
  }

  async function confirm() {
    if (!zone || !slot) return;

    const details = form.getValues();
    setSubmitting(true);

    try {
      const res = await fetch(api('/api/bookings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: zone.id,
          slotId: slot.id,
          name: details.name,
          phone: details.phone,
          email: details.email,
          partySize: details.partySize,
        }),
      });

      const payload = (await res.json()) as {
        booking?: { id: string };
        error?: string;
      };

      if (res.status === 409) {
        toast.error(payload.error ?? 'That slot was just booked. Pick another?');
        setStep(2);
        await loadSlots(zone.id, date);
        return;
      }

      if (!res.ok || !payload.booking) {
        toast.error(
          payload.error ?? 'Something broke on our end. Try again in a moment.',
        );
        return;
      }

      router.push(`/book/confirm/${payload.booking.id}`);
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  async function goToReview() {
    const valid = await form.trigger();
    if (valid) setStep(4);
  }

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress step={step} />

      {step > 1 ? (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 self-start"
          onClick={() => setStep((current) => Math.max(1, current - 1))}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      ) : null}

      {/* Step 1 — zone */}
      {step === 1 ? (
        <section aria-labelledby="step-zone" className="flex flex-col gap-6">
          <div>
            <h2 id="step-zone" className="text-h2">
              Which world tonight?
            </h2>
            <p className="mt-2 max-w-prose text-meta text-muted-foreground">
              Pick a zone and we will show you what is still open over the next 30 days.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {zones.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => chooseZone(candidate.id)}
                className="rounded-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
                aria-label={`Choose ${candidate.name}`}
              >
                <ZoneCard zone={candidate} href={null} />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Step 2 — date and time */}
      {step === 2 && zone ? (
        <section aria-labelledby="step-time" className="flex flex-col gap-6">
          <div>
            <h2 id="step-time" className="text-h2">
              When works for you?
            </h2>
            <p className="mt-2 text-meta text-muted-foreground">
              {zone.name} · {inr(zone.price_per_hour)} an hour · up to {zone.capacity}{' '}
              players
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
            <div className="rounded-card border border-border bg-surface">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(next) => next && setDate(next)}
                disabled={{ before: new Date(), after: lastBookableDay }}
                fromDate={new Date()}
                toDate={lastBookableDay}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h3">
                  {date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </h3>
                <span className="text-meta text-muted-foreground">
                  {slots.filter((item) => item.booked === 0).length} open
                </span>
              </div>

              <SlotPicker
                slots={slots}
                loading={loadingSlots}
                selectedId={slot?.id ?? null}
                minTime={minTime}
                onSelect={setSlot}
              />

              <Button
                className="mt-2 self-start"
                disabled={!slot}
                onClick={() => setStep(3)}
              >
                {slot
                  ? `Continue with ${prettyTime(slot.time)}`
                  : 'Pick a time to continue'}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* Step 3 — details */}
      {step === 3 && zone && slot ? (
        <section aria-labelledby="step-details" className="flex flex-col gap-6">
          <div>
            <h2 id="step-details" className="text-h2">
              Who is the booking for?
            </h2>
            <p className="mt-2 text-meta text-muted-foreground">
              We send the booking ID by SMS so the counter can find you quickly.
            </p>
          </div>

          <form
            className="grid max-w-xl gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              goToReview();
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" autoComplete="name" {...form.register('name')} />
              {form.formState.errors.name ? (
                <p className="text-meta text-red-300">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Mobile number</Label>
              <div className="flex items-stretch">
                <span className="inline-flex items-center rounded-l-button border border-r-0 border-input bg-elevated px-3.5 font-mono text-meta text-muted-foreground">
                  +91
                </span>
                <Input
                  id="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  className="rounded-l-none"
                  {...form.register('phone')}
                />
              </div>
              {form.formState.errors.phone ? (
                <p className="text-meta text-red-300">
                  {form.formState.errors.phone.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="party">Party size</Label>
                <span className="inline-flex items-center gap-1.5 font-mono text-data text-foreground">
                  <Users className="size-3.5 text-muted-foreground" />
                  {partySize}
                </span>
              </div>
              <Slider
                id="party"
                min={1}
                max={Math.min(10, zone.capacity)}
                step={1}
                value={[partySize]}
                onValueChange={([next]) => form.setValue('partySize', next ?? 1)}
                aria-label="Party size"
              />
              <p className="text-meta text-muted-foreground">
                {zone.name} holds up to {zone.capacity}.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email, if you want a receipt</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="optional"
                {...form.register('email')}
              />
              {form.formState.errors.email ? (
                <p className="text-meta text-red-300">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="self-start">
              Review booking
            </Button>
          </form>
        </section>
      ) : null}

      {/* Step 4 — review */}
      {step === 4 && zone && slot ? (
        <section aria-labelledby="step-confirm" className="flex flex-col gap-6">
          <div>
            <h2 id="step-confirm" className="text-h2">
              Check this over
            </h2>
            <p className="mt-2 text-meta text-muted-foreground">
              Nothing is charged online. You pay at the counter when you arrive.
            </p>
          </div>

          <dl className="max-w-xl divide-y divide-border rounded-card border border-border bg-surface px-6">
            {[
              ['Zone', zone.name],
              [
                'Date',
                date.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }),
              ],
              ['Time', `${prettyTime(slot.time)} for one hour`],
              ['Party size', `${form.getValues('partySize')} players`],
              ['Name', form.getValues('name')],
              ['Mobile', `+91 ${form.getValues('phone')}`],
              ['Due at the counter', inr(zone.price_per_hour)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-meta text-muted-foreground">{label}</dt>
                <dd
                  className={cn(
                    'text-right text-meta text-foreground',
                    (label === 'Due at the counter' || label === 'Time') && 'font-mono',
                  )}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <Separator className="max-w-xl" />

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={confirm} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? 'Reserving your slot' : 'Confirm Booking'}
            </Button>
            <Button variant="ghost" onClick={() => setStep(3)} disabled={submitting}>
              Change details
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
