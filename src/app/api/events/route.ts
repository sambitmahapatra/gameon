import type { NextRequest } from 'next/server';
import { listEvents, registerForEvent } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { databaseUnavailable, fail, ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  const category = request.nextUrl.searchParams.get('category') ?? undefined;
  const events = await withDb(async () => await listEvents(category));
  return ok({ events });
}

export async function POST(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('Send a JSON body');
  }

  const id = (body as { eventId?: string })?.eventId;
  if (!id) return fail('eventId is required');

  const registered = await withDb(async () => await registerForEvent(id));
  if (!registered) return fail('That event is full or does not exist', 409);

  return ok({ eventId: id, registered: true });
}
