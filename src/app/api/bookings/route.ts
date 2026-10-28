import type { NextRequest } from 'next/server';
import {
  SlotUnavailableError,
  createBooking,
  getSlot,
  getZone,
  listBookings,
} from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { fail, ok } from '@/lib/http';
import { bookingInputSchema } from '@/lib/validation';
import type { BookingStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Demo-grade guard for the admin listing (spec 1.7) — not real auth. */
function adminKeyValid(request: NextRequest) {
  const expected = process.env.ADMIN_KEY ?? 'gameon-demo';
  return request.nextUrl.searchParams.get('key') === expected;
}

export async function GET(request: NextRequest) {
  if (!adminKeyValid(request)) {
    return fail('A valid ?key= is required to list bookings', 401);
  }

  const params = request.nextUrl.searchParams;
  const status = params.get('status');

  const bookings = withDb(() =>
    listBookings({
      status:
        status === 'confirmed' || status === 'cancelled'
          ? (status as BookingStatus)
          : undefined,
      zoneId: params.get('zoneId') ?? undefined,
      from: params.get('from') ?? undefined,
      to: params.get('to') ?? undefined,
    }),
  );

  return ok({ bookings });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('Send a JSON body');
  }

  const parsed = bookingInputSchema.safeParse(body);
  if (!parsed.success) {
    return fail('Check the booking details', 422, {
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const input = parsed.data;

  try {
    const booking = withDb(() => {
      if (!getZone(input.zoneId)) throw new Error('NO_ZONE');

      const slot = getSlot(input.slotId);
      if (!slot || slot.zone_id !== input.zoneId) throw new Error('NO_SLOT');

      const zone = getZone(input.zoneId)!;
      if (input.partySize > zone.capacity) throw new Error('OVER_CAPACITY');

      return createBooking({
        zoneId: input.zoneId,
        slotId: input.slotId,
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        partySize: input.partySize,
      });
    });

    return ok({ booking }, { status: 201 });
  } catch (error) {
    if (error instanceof SlotUnavailableError) {
      return fail('That slot was just booked. Pick another?', 409);
    }
    if (error instanceof Error && error.message === 'NO_ZONE') {
      return fail('No such zone', 404);
    }
    if (error instanceof Error && error.message === 'NO_SLOT') {
      return fail('That time slot does not belong to the chosen zone', 400);
    }
    if (error instanceof Error && error.message === 'OVER_CAPACITY') {
      return fail('That party is larger than the zone holds', 422);
    }
    console.error('[POST /api/bookings]', error);
    return fail('Something broke on our end. Try again in a moment.', 500);
  }
}
