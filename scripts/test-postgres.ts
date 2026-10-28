import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import type { Pool } from 'pg';

/** Executes the production queries against embedded PostgreSQL, without credentials. */
async function main() {
  const engine = new PGlite();
  let queue = Promise.resolve();
  const query = async (text: string, values: unknown[] = []) => {
    const result = await engine.query(text, values);
    return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length };
  };
  const pool = {
    query,
    on: () => {},
    connect: async () => {
      const previous = queue;
      let release!: () => void;
      queue = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      return { query, release };
    },
  };
  // PGlite has one connection; serialize checked-out transaction clients.
  // Production uses pg.Pool clients against Supabase's transaction pooler.
  (globalThis as unknown as { gameonPostgres: Pool }).gameonPostgres =
    pool as unknown as Pool;
  process.env.DATABASE_URL = 'postgresql://embedded-test/gameon';
  const db = await import('../src/lib/postgres');
  const { seedPostgres } = await import('../src/lib/seed-postgres');
  const { SlotUnavailableError } = await import('../src/lib/db-errors');
  try {
    const schema = await readFile(
      new URL('./migrations/001-postgres.sql', import.meta.url),
      'utf8',
    );
    await engine.exec(schema);
    await engine.exec(schema); // DDL is repeatable.
    await seedPostgres();
    assert.equal((await db.getZones()).length, 6);
    assert.equal((await db.listEvents()).length, 8);
    assert.equal((await db.getAdminStats()).activeMembers, 0);
    const allSlots = await query('SELECT * FROM slots ORDER BY date, time, id');
    assert.equal(allSlots.rows.length, 6 * 30 * 13);
    const slot = allSlots.rows[0] as { id: number; zone_id: string; date: string };
    assert((await db.getZone(slot.zone_id))?.capacity);
    assert.equal((await db.getAvailableSlots(slot.zone_id, slot.date)).length, 13);
    const details = {
      zoneId: slot.zone_id,
      slotId: slot.id,
      name: 'Postgres QA',
      phone: '+919000000000',
      partySize: 1,
    };
    const claims = await Promise.allSettled([
      db.createBooking(details),
      db.createBooking(details),
    ]);
    assert.equal(claims.filter((c) => c.status === 'fulfilled').length, 1);
    const rejected = claims.find((c) => c.status === 'rejected');
    assert(
      rejected?.status === 'rejected' && rejected.reason instanceof SlotUnavailableError,
    );
    const accepted = claims.find((c) => c.status === 'fulfilled');
    assert(accepted?.status === 'fulfilled');
    const booking = accepted.value;
    assert.equal((await db.getBooking(booking.id))?.phone, details.phone);
    assert.equal(
      (await db.listBookings({ zoneId: details.zoneId, status: 'confirmed' })).length,
      1,
    );
    // Re-running setup must not free occupied slots or overwrite live records.
    await seedPostgres();
    assert.equal((await db.getSlot(slot.id))?.booked, 1);
    assert.equal(await db.cancelBooking(booking.id), true);
    assert.equal(await db.cancelBooking(booking.id), false);
    assert.equal((await db.getSlot(slot.id))?.booked, 0);
    // A failed insert must roll back the claimed slot.
    await assert.rejects(db.createBooking({ ...details, partySize: 0 }));
    assert.equal((await db.getSlot(slot.id))?.booked, 0);
    const rebooked = await db.createBooking(details);
    assert.equal(
      (await db.listBookings({ status: 'confirmed', from: slot.date, to: slot.date }))
        .length,
      1,
    );
    assert.equal((await db.getSlot(rebooked.slot_id))?.booked, 1);
    const member = await db.createMember({
      name: 'QA Member',
      phone: '+919000000001',
      tier: 'silver',
    });
    const upgraded = await db.createMember({
      name: 'QA Member',
      phone: member.phone,
      tier: 'gold',
    });
    assert.equal(upgraded.id, member.id);
    assert.equal(upgraded.tier, 'gold');
    const event = (await db.listEvents('weekly'))[0];
    for (let i = 0; i < event.slots; i++)
      assert.equal(await db.registerForEvent(event.id), true);
    assert.equal(await db.registerForEvent(event.id), false);
    await seedPostgres();
    assert.equal((await db.listEvents('weekly'))[0].registered, event.slots);
    assert.equal((await db.getAdminStats()).activeMembers, 1);
    assert.equal((await db.getSiteStats()).zonesOpen, 6);
    assert.equal(typeof (await db.getLiveCount()), 'number');
    const security = await query(
      "SELECT relrowsecurity FROM pg_class WHERE relname IN ('zones', 'slots', 'bookings', 'events', 'members')",
    );
    assert.equal(security.rows.length, 5);
    assert(
      security.rows.every((row) => (row as { relrowsecurity: boolean }).relrowsecurity),
    );
    console.log(
      'PostgreSQL integration passed: schema, seeds, all queries, double claim, rollback, cancel/rebook, membership, event capacity, seed preservation and RLS.',
    );
  } finally {
    await engine.close();
  }
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
