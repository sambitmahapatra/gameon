import { getZones } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  const zones = withDb(() => getZones());
  return ok({ zones });
}
