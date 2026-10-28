import { ZONE_SEED, EVENT_SEED } from './data/venue';
import { ensureFutureSlots, getPool } from './postgres';

/** Explicit, repeatable setup; never inserts fictitious members or bookings. */
export async function seedPostgres(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const zone of ZONE_SEED) {
      await client.query(
        `INSERT INTO zones (id, name, tagline, description, price_per_hour, capacity, image, accent_hex)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT(id) DO UPDATE SET
        name = excluded.name, tagline = excluded.tagline, description = excluded.description,
        price_per_hour = excluded.price_per_hour, capacity = excluded.capacity, image = excluded.image, accent_hex = excluded.accent_hex`,
        [
          zone.id,
          zone.name,
          zone.tagline,
          zone.description,
          zone.price_per_hour,
          zone.capacity,
          `/images/zones/${zone.id}.webp`,
          zone.accent_hex,
        ],
      );
    }
    for (const event of EVENT_SEED) {
      await client.query(
        `INSERT INTO events (id, title, game, date, prize_pool, slots, registered, category)
        VALUES ($1, $2, $3, to_char((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date + $4::int, 'YYYY-MM-DD'), $5, $6, 0, $7)
        ON CONFLICT(id) DO NOTHING`,
        [
          event.id,
          event.title,
          event.game,
          event.dayOffset,
          event.prize_pool,
          event.slots,
          event.category,
        ],
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  await ensureFutureSlots();
}
