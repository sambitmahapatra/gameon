import { getDb } from './db';
import { toDateKey } from './utils';
import type { EventCategory } from './types';

/** Opening hours: hourly slots from 10:00 to 22:00, 30 days ahead (spec 1.6). */
const OPEN_HOUR = 10;
const CLOSE_HOUR = 22;
const DAYS_AHEAD = 30;

type ZoneSeed = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  accent_hex: string;
};

export const ZONE_SEED: ZoneSeed[] = [
  {
    id: 'flight-sim',
    name: 'Flight Simulator',
    tagline: 'Fly a Boeing 737. Really.',
    description:
      'A full cockpit replica with authentic yoke, throttle quadrant and rudder pedals, wrapped in three curved displays. Take off from Mumbai, hand-fly an approach into Leh, or let an instructor walk you through your first circuit. Sessions run with a briefing, so beginners are welcome.',
    price_per_hour: 1200,
    capacity: 2,
    accent_hex: '#FF6B35',
  },
  {
    id: 'vr-arena',
    name: 'VR Arena',
    tagline: 'Step into other worlds',
    description:
      'A 40-square-metre free-roam arena with wireless headsets and body tracking, so you walk the space instead of standing still. Co-op raids, zombie defence, escape rooms and a sandbox creative mode. Staff handle setup and spotting; you just play.',
    price_per_hour: 800,
    capacity: 6,
    accent_hex: '#00E5FF',
  },
  {
    id: 'racing-cockpit',
    name: 'Racing Cockpit',
    tagline: 'Full-motion rig, F1 pedals',
    description:
      'Two motion rigs with direct-drive wheels, load-cell pedals and triple curved screens. Run hot laps at Buddh, race the house league on Assetto Corsa Competizione, or bring three friends and split a one-hour grand prix with live timing on the lounge screens.',
    price_per_hour: 600,
    capacity: 4,
    accent_hex: '#FFC857',
  },
  {
    id: 'streaming-pod',
    name: 'Streaming Pod',
    tagline: 'Broadcast-ready setup',
    description:
      'A sound-treated booth with a condenser mic, two cameras, key and fill lighting, and a scene-ready OBS install. Sign in to your own accounts, hit go live, and leave with the local recording. Ideal for first streams, podcast pilots and audition reels.',
    price_per_hour: 500,
    capacity: 2,
    accent_hex: '#FF4D8F',
  },
  {
    id: 'esports-station',
    name: 'Esports Station',
    tagline: 'RTX 4080, 240Hz, your game',
    description:
      'Ten tournament-spec stations on a 1 Gbps line, each with an RTX 4080, a 240Hz panel and swappable mechanical keyboards. Valorant, CS2, Dota 2, BGMI and Apex are pre-installed and patched. Your peripherals plug straight in if you prefer your own.',
    price_per_hour: 400,
    capacity: 10,
    accent_hex: '#7B61FF',
  },
  {
    id: 'console-lounge',
    name: 'Console Lounge',
    tagline: 'PS5, Xbox Series X and Switch',
    description:
      'Low leather seating around 65-inch OLEDs, with PS5, Xbox Series X and Switch on every screen. Built for couch co-op: FC 26, Tekken 8, Mario Kart and a shelf of party games. Café service reaches this zone, so food comes to you.',
    price_per_hour: 350,
    capacity: 8,
    accent_hex: '#00D97E',
  },
];

type EventSeed = {
  id: string;
  title: string;
  game: string;
  dayOffset: number;
  prize_pool: number;
  slots: number;
  registered: number;
  category: EventCategory;
};

/** Dates are offsets from today so the seed never looks stale. */
const EVENT_SEED: EventSeed[] = [
  {
    id: 'valorant-thursdays',
    title: 'Valorant Thursdays',
    game: 'Valorant',
    dayOffset: 3,
    prize_pool: 5000,
    slots: 40,
    registered: 31,
    category: 'weekly',
  },
  {
    id: 'fifa-fridays',
    title: 'FC 26 Fridays',
    game: 'EA Sports FC 26',
    dayOffset: 4,
    prize_pool: 3000,
    slots: 32,
    registered: 18,
    category: 'weekly',
  },
  {
    id: 'tekken-tuesdays',
    title: 'Tekken Tuesdays',
    game: 'Tekken 8',
    dayOffset: 8,
    prize_pool: 2500,
    slots: 24,
    registered: 9,
    category: 'weekly',
  },
  {
    id: 'bgmi-showdown',
    title: 'BGMI Powai Showdown',
    game: 'BGMI',
    dayOffset: 18,
    prize_pool: 50000,
    slots: 64,
    registered: 52,
    category: 'monthly',
  },
  {
    id: 'fc26-powai-cup',
    title: 'FC 26 Powai Cup',
    game: 'EA Sports FC 26',
    dayOffset: 25,
    prize_pool: 25000,
    slots: 48,
    registered: 20,
    category: 'monthly',
  },
  {
    id: 'sim-racing-gp',
    title: 'Powai Sim Racing Grand Prix',
    game: 'Assetto Corsa Competizione',
    dayOffset: 32,
    prize_pool: 30000,
    slots: 24,
    registered: 11,
    category: 'monthly',
  },
  {
    id: 'corporate-offsite',
    title: 'Corporate Offsite: Squad Wars',
    game: 'Mixed zones',
    dayOffset: 12,
    prize_pool: 0,
    slots: 60,
    registered: 42,
    category: 'corporate',
  },
  {
    id: 'corporate-vr-lab',
    title: 'Team Building: VR Escape Lab',
    game: 'VR co-op',
    dayOffset: 21,
    prize_pool: 0,
    slots: 36,
    registered: 14,
    category: 'corporate',
  },
];

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
