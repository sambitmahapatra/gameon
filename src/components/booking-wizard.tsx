'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AnimatePresence,
  motion,
  useReducedMotion as useFramerReducedMotion,
} from 'framer-motion';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

import { BookingProgress } from '@/components/booking-progress';
import { SlotPicker } from '@/components/slot-picker';
import { ZoneCard } from '@/components/zone-card';
import { Calendar } from '@/components/ui/calendar';
import { FloatingField } from '@/components/ui/floating-field';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Slot, Zone } from '@/lib/types';
import { api, apiBase, inrDigits, prettyTime, toDateKey } from '@/lib/utils';
import { type DetailsInput, detailsSchema } from '@/lib/validation';

type BookingWizardProps = { zones: Zone[] };

const LAST_DAY_OFFSET = 29; // the seed covers 30 days from today

/**
 * Four steps: zone → date and time → details → review. The logic and the API
 * calls are unchanged from the working build; only the surface is the V3
 * design. The server is still the authority on availability — a 409 on
 * confirm sends the user back to step 2 with fresh slots.
 */
export function BookingWizard({ zones }: BookingWizardProps) {
  const router = useRouter();
  const params = useSearchParams();

  const preselected = params.get('zone');
  const [step, setStep] = useState(
    preselected && zones.some((zone) => zone.id === preselected) ? 2 : 1,
  );
  const [zoneId, setZoneId] = useState<string | null>(
    preselected && zones.some((zone) => zone.id === preselected) ? preselected : null,
  );
  const [date, setDate] = useState<Date>(() => new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // +1 moving forward, -1 going back: decides which side a step slides in from
  const [direction, setDirection] = useState(1);
  const reducedMotion = useFramerReducedMotion();

  const zone = zones.find((candidate) => candidate.id === zoneId) ?? null;

  function go(next: number) {
    setDirection(next >= step ? 1 : -1);
    setStep(next);
  }

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
    if (!zoneId) return;
    setSlot(null);
    loadSlots(zoneId, date);
  }, [zoneId, date, loadSlots]);

  // Today's slots that have already started are not bookable.
  const isToday = toDateKey(date) === toDateKey(new Date());
  const minTime = isToday
    ? `${String(new Date().getHours() + 1).padStart(2, '0')}:00`
    : null;

  const lastBookableDay = new Date();
  lastBookableDay.setDate(lastBookableDay.getDate() + LAST_DAY_OFFSET);

  function chooseZone(next: string) {
    setZoneId(next);
    go(2);
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
        go(2);
        await loadSlots(zone.id, date);
        return;
      }

      if (!res.ok || !payload.booking) {
        toast.error(
          payload.error ?? 'Something broke on our end. Try again in a moment.',
        );
        return;
      }

      const confirmationPath = `/book/confirm/${payload.booking.id}`;
      if (apiBase) window.location.assign(api(confirmationPath));
      else router.push(confirmationPath);
    } catch {
      toast.error('We cannot reach the server. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  async function goToReview() {
    const valid = await form.trigger();
    if (valid) go(4);
  }

  const longDate = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col gap-10">
      <BookingProgress step={step} />

      {step > 1 ? (
        <button
          type="button"
          onClick={() => go(Math.max(1, step - 1))}
          className="-ml-1 inline-flex items-center gap-2 self-start text-meta text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back
        </button>
      ) : null}

      {/*
        One step on screen at a time, sliding in from the side it came from.
        mode="wait" lets the outgoing step finish first, so the two never
        overlap mid-scroll.
      */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={reducedMotion ? false : { opacity: 0, x: direction * 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: direction * -48 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Step 1 — zone */}
          {step === 1 ? (
            <section aria-labelledby="step-zone" className="flex flex-col gap-8">
              <div>
                <div className="eyebrow">Step one</div>
                <h2 id="step-zone" className="mt-4 text-h2">
                  Which world tonight?
                </h2>
                <p className="sub mt-3">
                  Pick a zone and we will show you what is still open over the next 30
                  days.
                </p>
              </div>

              <div className="zones-grid">
                {zones.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => chooseZone(candidate.id)}
                    className="rounded-card text-left"
                    aria-label={`Choose ${candidate.name}`}
                  >
                    <ZoneCard zone={candidate} href={null} uid={`bw-${candidate.id}`} />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {/* Step 2 — date and time */}
          {step === 2 && zone ? (
            <section aria-labelledby="step-time" className="flex flex-col gap-8">
              <div>
                <div className="eyebrow">Step two</div>
                <h2 id="step-time" className="mt-4 text-h2">
                  When works for you?
                </h2>
                <p className="mono mt-3 text-fg-muted">
                  {zone.name} · ₹{inrDigits(zone.price_per_hour)}/hour · up to{' '}
                  {zone.capacity} players
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
                <div className="panel panel--elevated h-fit p-2">
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
                    <h3>{longDate}</h3>
                    <span className="mono text-fg-muted">
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

                  <button
                    type="button"
                    className="btn btn--primary btn--lg mt-2 self-start"
                    disabled={!slot}
                    onClick={() => go(3)}
                  >
                    {slot
                      ? `Continue with ${prettyTime(slot.time)}`
                      : 'Pick a time to continue'}
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {/* Step 3 — details */}
          {step === 3 && zone && slot ? (
            <section aria-labelledby="step-details" className="flex flex-col gap-8">
              <div>
                <div className="eyebrow">Step three</div>
                <h2 id="step-details" className="mt-4 text-h2">
                  Who is the booking for?
                </h2>
                <p className="sub mt-3">
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
                <FloatingField
                  id="name"
                  label="Name"
                  autoComplete="name"
                  error={form.formState.errors.name?.message}
                  {...form.register('name')}
                />

                <FloatingField
                  id="phone"
                  label="Mobile number"
                  prefix="+91"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  error={form.formState.errors.phone?.message}
                  {...form.register('phone')}
                />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="party">Party size</Label>
                    <span className="mono inline-flex items-center gap-1.5 text-fg">
                      <Users aria-hidden="true" className="size-3.5 text-fg-muted" />
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
                  <p className="text-meta text-fg-muted">
                    {zone.name} holds up to {zone.capacity}.
                  </p>
                </div>

                <FloatingField
                  id="email"
                  label="Email, if you want a receipt"
                  type="email"
                  autoComplete="email"
                  error={form.formState.errors.email?.message}
                  hint="Optional. We only use it for the receipt."
                  {...form.register('email')}
                />

                <button type="submit" className="btn btn--primary btn--lg self-start">
                  Review booking
                </button>
              </form>
            </section>
          ) : null}

          {/* Step 4 — review */}
          {step === 4 && zone && slot ? (
            <section aria-labelledby="step-confirm" className="flex flex-col gap-8">
              <div>
                <div className="eyebrow">Last look</div>
                <h2 id="step-confirm" className="mt-4 text-h2">
                  Check this over
                </h2>
                <p className="sub mt-3">
                  Nothing is charged online. You pay at the counter when you arrive.
                </p>
              </div>

              {/* same visual language as a pricing tier */}
              <div className="tier tier--highlight max-w-xl">
                <div className="tier__name">{zone.name}</div>
                <div className="tier__price">
                  ₹{inrDigits(zone.price_per_hour)}
                  <small>/hour</small>
                </div>
                <dl className="mt-6">
                  {[
                    ['Date', longDate],
                    ['Time', `${prettyTime(slot.time)} for one hour`],
                    ['Party size', `${form.getValues('partySize')} players`],
                    ['Name', form.getValues('name')],
                    ['Mobile', `+91 ${form.getValues('phone')}`],
                  ].map(([label, value]) => (
                    <div key={label} className="meta-row">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                  <div className="meta-row">
                    <dt>Due at the counter</dt>
                    <dd className="mono">₹{inrDigits(zone.price_per_hour)}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={confirm}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : null}
                  {submitting ? 'Reserving your slot' : 'Confirm booking'}
                </button>
                <button
                  type="button"
                  className="text-meta text-fg-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
                  onClick={() => go(3)}
                  disabled={submitting}
                >
                  Change details
                </button>
              </div>
            </section>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
