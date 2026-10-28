import { readFile, writeFile } from 'node:fs/promises';
import { ZONE_SEED, EVENT_SEED } from '../src/lib/data/venue';

const quote = (value: string | number) =>
  typeof value === 'number' ? String(value) : `'${value.replaceAll("'", "''")}'`;
async function main() {
  const schema = await readFile(
    new URL('./migrations/001-postgres.sql', import.meta.url),
    'utf8',
  );
  const zones = ZONE_SEED.map(
    (z) =>
      `(${[z.id, z.name, z.tagline, z.description, z.price_per_hour, z.capacity, `/images/zones/${z.id}.webp`, z.accent_hex].map(quote).join(', ')})`,
  ).join(',\n');
  const events = EVENT_SEED.map(
    (e) =>
      `(${[e.id, e.title, e.game].map(quote).join(', ')}, to_char((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + ${e.dayOffset}, 'YYYY-MM-DD'), ${[e.prize_pool, e.slots, 0, e.category].map(quote).join(', ')})`,
  ).join(',\n');
  const sql = `-- GameOn: run this entire file in Supabase SQL Editor.\n-- Repeatable setup: existing reservations, members and registrations are preserved.\n-- No credentials are contained in this file.\n\n${schema}\n\nBEGIN;\nINSERT INTO zones (id, name, tagline, description, price_per_hour, capacity, image, accent_hex) VALUES\n${zones}\nON CONFLICT(id) DO UPDATE SET name = excluded.name, tagline = excluded.tagline, description = excluded.description, price_per_hour = excluded.price_per_hour, capacity = excluded.capacity, image = excluded.image, accent_hex = excluded.accent_hex;\n\nINSERT INTO events (id, title, game, date, prize_pool, slots, registered, category) VALUES\n${events}\nON CONFLICT(id) DO NOTHING;\n\nINSERT INTO slots (zone_id, date, time)\nSELECT z.id, to_char((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + day.n, 'YYYY-MM-DD'), lpad(hour.n::text, 2, '0') || ':00'\nFROM zones z CROSS JOIN generate_series(0, 29) AS day(n) CROSS JOIN generate_series(10, 22) AS hour(n)\nON CONFLICT(zone_id, date, time) DO NOTHING;\nCOMMIT;\n\nSELECT 'zones' AS table_name, count(*) AS rows FROM zones\nUNION ALL SELECT 'slots', count(*) FROM slots\nUNION ALL SELECT 'events', count(*) FROM events;\n`;
  await writeFile(new URL('../docs/SUPABASE_SETUP.sql', import.meta.url), sql);
  console.log('Created docs/SUPABASE_SETUP.sql (schema and reference content only).');
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
