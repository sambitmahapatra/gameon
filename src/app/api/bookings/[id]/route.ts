import type { NextRequest } from 'next/server';
import { cancelBooking, getBooking } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { databaseUnavailable, fail, ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  const booking = await withDb(async () => await getBooking(params.id));
  if (!booking) return fail('No booking with that ID', 404);
  return ok({ booking });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  const result = await withDb(async () => {
    const booking = await getBooking(params.id);
    if (!booking) return 'missing' as const;
    return (await cancelBooking(params.id)) ? 'cancelled' : 'already-cancelled';
  });

  if (result === 'missing') return fail('No booking with that ID', 404);
  if (result === 'already-cancelled') {
    return fail('That booking was already cancelled', 409);
  }

  return ok({ id: params.id, status: 'cancelled' });
}
