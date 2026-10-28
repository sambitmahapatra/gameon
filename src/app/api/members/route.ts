import type { NextRequest } from 'next/server';
import { createMember } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { databaseUnavailable, fail, ok } from '@/lib/http';
import { memberInputSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const unavailable = databaseUnavailable();
  if (unavailable) return unavailable;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail('Send a JSON body');
  }

  const parsed = memberInputSchema.safeParse(body);
  if (!parsed.success) {
    return fail('Check the form', 422, { issues: parsed.error.flatten().fieldErrors });
  }

  const member = await withDb(
    async () => await createMember({ ...parsed.data, phone: `+91${parsed.data.phone}` }),
  );
  return ok({ member }, { status: 201 });
}
