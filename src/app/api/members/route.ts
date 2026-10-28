import type { NextRequest } from 'next/server';
import { createMember } from '@/lib/db';
import { withDb } from '@/lib/bootstrap';
import { fail, ok } from '@/lib/http';
import { memberInputSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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

  const member = withDb(() =>
    createMember({ ...parsed.data, phone: `+91${parsed.data.phone}` }),
  );
  return ok({ member }, { status: 201 });
}
