import type { NextRequest } from 'next/server';
import { getAvailableSlots, getZone } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { fail, ok } from '@/lib/http';
import { dateKeySchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const zoneId = request.nextUrl.searchParams.get('zoneId');
  const date = request.nextUrl.searchParams.get('date');

  if (!zoneId) return fail('zoneId is required');

  const parsedDate = dateKeySchema.safeParse(date);
  if (!parsedDate.success) return fail('date must be YYYY-MM-DD');

  const result = withDb(() => {
    if (!getZone(zoneId)) return null;
    return getAvailableSlots(zoneId, parsedDate.data);
  });

  if (result === null) return fail('No such zone', 404);

  return ok({ zoneId, date: parsedDate.data, slots: result });
}
