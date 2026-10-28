import { randomUUID } from 'node:crypto';
import { Pool, type PoolClient } from 'pg';
import { DatabaseConfigurationError, SlotUnavailableError } from './db-errors';
import type { AdminStats, BookingFilter, CreateBookingInput, SiteStats } from './sqlite';
import type { BookingDetail, GameEvent, Member, Slot, Zone } from './types';

const state = globalThis as unknown as { gameonPostgres?: Pool };
export function getPool(): Pool {
  if (!process.env.DATABASE_URL) throw new DatabaseConfigurationError();
  if (!state.gameonPostgres) {
    state.gameonPostgres = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 20_000,
      allowExitOnIdle: true,
    });
    // An idle connection failure must not take down the server process.
    state.gameonPostgres.on('error', () =>
      console.error('[GameOn DB] Idle PostgreSQL connection closed'),
    );
  }
  return state.gameonPostgres;
}
async function rows<T>(text: string, values: unknown[] = []): Promise<T[]> {
  return (await getPool().query(text, values)).rows as T[];
}
async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
const TODAY = "(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date";
const DAY_KEY = `to_char(${TODAY}, 'YYYY-MM-DD')`;

/** Daily top-up only: schema and reference data are installed explicitly. */
export async function ensureFutureSlots(): Promise<void> {
  await getPool().query(`INSERT INTO slots (zone_id, date, time)
    SELECT z.id, to_char(${TODAY} + day.n, 'YYYY-MM-DD'), lpad(hour.n::text, 2, '0') || ':00'
    FROM zones z CROSS JOIN generate_series(0, 29) AS day(n) CROSS JOIN generate_series(10, 22) AS hour(n)
    ON CONFLICT (zone_id, date, time) DO NOTHING`);
}
export async function getZones(): Promise<Zone[]> {
  return rows<Zone>('SELECT * FROM zones ORDER BY price_per_hour DESC');
}
export async function getZone(id: string): Promise<Zone | undefined> {
  return (await rows<Zone>('SELECT * FROM zones WHERE id = $1', [id]))[0];
}
export async function getAvailableSlots(zoneId: string, date: string): Promise<Slot[]> {
  return rows<Slot>(
    'SELECT * FROM slots WHERE zone_id = $1 AND date = $2 ORDER BY time',
    [zoneId, date],
  );
}
export async function getSlot(id: number): Promise<Slot | undefined> {
  return (await rows<Slot>('SELECT * FROM slots WHERE id = $1', [id]))[0];
}
const BOOKING_SELECT = `SELECT b.*, z.name AS zone_name, z.accent_hex AS zone_accent,
  z.price_per_hour, s.date, s.time FROM bookings b JOIN zones z ON z.id = b.zone_id JOIN slots s ON s.id = b.slot_id`;

export async function createBooking(input: CreateBookingInput): Promise<BookingDetail> {
  return transaction(async (client) => {
    const claim = await client.query(
      'UPDATE slots SET booked = 1 WHERE id = $1 AND zone_id = $2 AND booked = 0 RETURNING id',
      [input.slotId, input.zoneId],
    );
    if (!claim.rowCount) throw new SlotUnavailableError();
    const year = new Intl.DateTimeFormat('en', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
    }).format(new Date());
    const id = `GON-${year}-${randomUUID().slice(0, 8).toUpperCase()}`;
    await client.query(
      `INSERT INTO bookings (id, zone_id, slot_id, name, phone, email, party_size, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed')`,
      [
        id,
        input.zoneId,
        input.slotId,
        input.name,
        input.phone,
        input.email ?? null,
        input.partySize,
      ],
    );
    const result = await client.query(`${BOOKING_SELECT} WHERE b.id = $1`, [id]);
    return result.rows[0] as BookingDetail;
  });
}
export async function getBooking(id: string): Promise<BookingDetail | undefined> {
  return (await rows<BookingDetail>(`${BOOKING_SELECT} WHERE b.id = $1`, [id]))[0];
}
export async function listBookings(filter: BookingFilter = {}): Promise<BookingDetail[]> {
  const where: string[] = [],
    values: (string | number)[] = [];
  const add = (column: string, operator: string, value: string | undefined) => {
    if (value) {
      values.push(value);
      where.push(`${column} ${operator} $${values.length}`);
    }
  };
  add('b.status', '=', filter.status);
  add('b.zone_id', '=', filter.zoneId);
  add('s.date', '>=', filter.from);
  add('s.date', '<=', filter.to);
  values.push(filter.limit ?? 500);
  return rows<BookingDetail>(
    `${BOOKING_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.date DESC, s.time DESC LIMIT $${values.length}`,
    values,
  );
}
export async function cancelBooking(id: string): Promise<boolean> {
  return transaction(async (client) => {
    const result = await client.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND status = 'confirmed' RETURNING slot_id",
      [id],
    );
    if (!result.rowCount) return false;
    await client.query('UPDATE slots SET booked = 0 WHERE id = $1', [
      result.rows[0].slot_id,
    ]);
    return true;
  });
}
export async function getAdminStats(): Promise<AdminStats> {
  const [today, revenue, occupancy, members] = await Promise.all([
    rows<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE s.date = ${DAY_KEY} AND b.status = 'confirmed'`,
    ),
    rows<{ total: number }>(
      `SELECT COALESCE(SUM(z.price_per_hour), 0)::int AS total FROM bookings b JOIN slots s ON s.id = b.slot_id JOIN zones z ON z.id = b.zone_id WHERE b.status = 'confirmed' AND s.date BETWEEN to_char(${TODAY} - 6, 'YYYY-MM-DD') AND ${DAY_KEY}`,
    ),
    rows<{ total: number; taken: number }>(
      `SELECT COUNT(*)::int AS total, COALESCE(SUM(booked), 0)::int AS taken FROM slots WHERE date BETWEEN ${DAY_KEY} AND to_char(${TODAY} + 6, 'YYYY-MM-DD')`,
    ),
    rows<{ n: number }>('SELECT COUNT(*)::int AS n FROM members'),
  ]);
  return {
    todayBookings: today[0].n,
    weekRevenue: revenue[0].total,
    occupancy7d: occupancy[0].total
      ? Math.round((occupancy[0].taken / occupancy[0].total) * 100)
      : 0,
    activeMembers: members[0].n,
  };
}
export async function getSiteStats(): Promise<SiteStats> {
  const [zones, tournaments, members, free] = await Promise.all([
    rows<{ n: number }>('SELECT COUNT(*)::int AS n FROM zones'),
    rows<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM events WHERE substring(date, 1, 7) = to_char(${TODAY}, 'YYYY-MM')`,
    ),
    rows<{ n: number }>('SELECT COUNT(*)::int AS n FROM members'),
    rows<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM slots WHERE date = ${DAY_KEY} AND booked = 0`,
    ),
  ]);
  return {
    zonesOpen: zones[0].n,
    tournamentsThisMonth: tournaments[0].n,
    members: members[0].n,
    slotsFreeToday: free[0].n,
  };
}
export async function getLiveCount(): Promise<number> {
  const result = await rows<{ seated: number }>(
    `SELECT COALESCE(SUM(b.party_size), 0)::int AS seated FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.status = 'confirmed' AND s.date = ${DAY_KEY} AND substring(s.time, 1, 2)::int = EXTRACT(HOUR FROM CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`,
  );
  return result[0].seated;
}
export async function listEvents(category?: string): Promise<GameEvent[]> {
  return category && category !== 'all'
    ? rows<GameEvent>('SELECT * FROM events WHERE category = $1 ORDER BY date', [
        category,
      ])
    : rows<GameEvent>('SELECT * FROM events ORDER BY date');
}
export async function registerForEvent(id: string): Promise<boolean> {
  const result = await getPool().query(
    'UPDATE events SET registered = registered + 1 WHERE id = $1 AND registered < slots RETURNING id',
    [id],
  );
  return Boolean(result.rowCount);
}
export async function createMember(input: {
  name: string;
  phone: string;
  tier: Member['tier'];
}): Promise<Member> {
  return (
    await rows<Member>(
      `INSERT INTO members (id, name, phone, tier) VALUES ($1, $2, $3, $4)
    ON CONFLICT(phone) DO UPDATE SET name = excluded.name, tier = excluded.tier RETURNING *`,
      [randomUUID(), input.name, input.phone, input.tier],
    )
  )[0];
}
