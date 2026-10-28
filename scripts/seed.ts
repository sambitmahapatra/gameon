/**
 * Standalone seed runner: npm run db:seed
 * Creates ./data/gameon.db if missing, then tops up zones, slots and events.
 */
import { ensureSeeded } from '../src/lib/seed';
import { getDb } from '../src/lib/db';

ensureSeeded();

const db = getDb();
const count = (table: string) =>
  (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

console.log('GameOn database seeded');
for (const table of ['zones', 'slots', 'bookings', 'events', 'members']) {
  console.log(`  ${table.padEnd(9)} ${count(table)}`);
}
