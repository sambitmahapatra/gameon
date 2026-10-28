import { getDb } from './sqlite';
import { ZONE_SEED, EVENT_SEED } from './data/venue';
import { toDateKey } from './utils';
const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;
const DAYS_AHEAD = 30;

function seedZones() {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO zones (id, name, tagline, description, price_per_hour, capacity, image, accent_hex)
     VALUES (@id, @name, @tagline, @description, @price_per_hour, @capacity, @image, @accent_hex)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       tagline = excluded.tagline,
       description = excluded.description,
       price_per_hour = excluded.price_per_hour,
       capacity = excluded.capacity,
       accent_hex = excluded.accent_hex`,
  );

  db.transaction(() => {
    for (const zone of ZONE_SEED) {
      insert.run({ ...zone, image: `/images/zones/${zone.id}.jpg` });
    }
  })();
}

function seedSlots() {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO slots (zone_id, date, time) VALUES (?, ?, ?)
       ON CONFLICT(zone_id, date, time) DO NOTHING`,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  db.transaction(() => {
    for (let day = 0; day < DAYS_AHEAD; day += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const key = toDateKey(date);

      for (let hour = OPEN_HOUR; hour <= CLOSE_HOUR; hour += 1) {
        const time = `${String(hour).padStart(2, '0')}:00`;
        for (const zone of ZONE_SEED) {
          insert.run(zone.id, key, time);
        }
      }
    }
  })();
}

/**
 * Marks a scattering of slots as taken so the picker and the admin dashboard
 * have something to show on a fresh database. Evenings fill up first.
 */
function seedOccupancy() {
  const db = getDb();
  const open = db
    .prepare(
      `SELECT id, time FROM slots
        WHERE booked = 0 AND date BETWEEN date('now','localtime') AND date('now','localtime','+6 days')`,
    )
    .all() as { id: number; time: string }[];

  const take = db.prepare('UPDATE slots SET booked = 1 WHERE id = ?');

  db.transaction(() => {
    for (const slot of open) {
      const hour = Number(slot.time.slice(0, 2));
      const chance = hour >= 18 ? 0.45 : hour >= 14 ? 0.22 : 0.1;
      if (Math.random() < chance) take.run(slot.id);
    }
  })();
}

function seedEvents() {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO events (id, title, game, date, prize_pool, slots, registered, category)
     VALUES (@id, @title, @game, @date, @prize_pool, @slots, @registered, @category)
     ON CONFLICT(id) DO UPDATE SET
       date = excluded.date,
       prize_pool = excluded.prize_pool,
       slots = excluded.slots,
       registered = excluded.registered`,
  );

  const today = new Date();

  db.transaction(() => {
    for (const event of EVENT_SEED) {
      const date = new Date(today);
      date.setDate(today.getDate() + event.dayOffset);
      const { dayOffset: _dayOffset, ...rest } = event;
      insert.run({ ...rest, date: toDateKey(date) });
    }
  })();
}

function seedMembers() {
  const db = getDb();
  const insert = db.prepare(
    `INSERT INTO members (id, name, phone, tier) VALUES (?, ?, ?, ?)
       ON CONFLICT(phone) DO NOTHING`,
  );
  const founders: [string, string, string, string][] = [
    ['m-001', 'Aditya Rane', '+919820100101', 'gold'],
    ['m-002', 'Sana Qureshi', '+919820100102', 'silver'],
    ['m-003', 'Rohit Kulkarni', '+919820100103', 'silver'],
    ['m-004', 'Meera Iyer', '+919820100104', 'bronze'],
    ['m-005', 'Kabir Shah', '+919820100105', 'bronze'],
  ];
  db.transaction(() => {
    for (const row of founders) insert.run(...row);
  })();
}

/**
 * Idempotent: safe to call on every server start. Slots are only topped up for
 * dates that do not have them yet, so existing bookings survive.
 */
export function ensureSeeded(): void {
  const db = getDb();
  const zoneCount = (db.prepare('SELECT COUNT(*) AS n FROM zones').get() as { n: number })
    .n;
  const firstRun = zoneCount === 0;

  seedZones();
  seedSlots();
  seedEvents();
  seedMembers();

  if (firstRun) seedOccupancy();
}
