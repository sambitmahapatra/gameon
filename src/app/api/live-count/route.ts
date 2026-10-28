import { getLiveCount } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { databaseUnavailable, ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  const count = await withDb(async () => await getLiveCount());
  return ok({ count });
}
