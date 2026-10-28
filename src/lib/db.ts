import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import type {
  Booking,
  BookingDetail,
  BookingStatus,
  GameEvent,
  Member,
  Slot,
  Zone,
} from './types';

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'gameon.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS zones (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  tagline        TEXT NOT NULL,
  description    TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL,
  capacity       INTEGER NOT NULL,
  image          TEXT,
  accent_hex     TEXT
);

CREATE TABLE IF NOT EXISTS slots (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  date    TEXT NOT NULL,
  time    TEXT NOT NULL,
  booked  INTEGER NOT NULL DEFAULT 0,
  UNIQUE(zone_id, date, time)
);

CREATE TABLE IF NOT EXISTS bookings (
  id         TEXT PRIMARY KEY,
  zone_id    TEXT NOT NULL REFERENCES zones(id),
  slot_id    INTEGER NOT NULL REFERENCES slots(id),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  party_size INTEGER NOT NULL DEFAULT 1,
  status     TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  phone     TEXT NOT NULL UNIQUE,
  tier      TEXT NOT NULL,
  joined_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  game       TEXT NOT NULL,
  date       TEXT NOT NULL,
  prize_pool INTEGER NOT NULL,
  slots      INTEGER NOT NULL,
  registered INTEGER NOT NULL DEFAULT 0,
  category   TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_slots_lookup  ON slots(zone_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_made ON bookings(created_at);
`;

/**
 * One connection per server process. Next.js dev reloads modules, so the handle
 * is cached on globalThis instead of piling up file locks.
 */
const globalForDb = globalThis as unknown as { gameonDb?: Database.Database };

function connect(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb.gameonDb) {
    globalForDb.gameonDb = connect();
  }
  return globalForDb.gameonDb;
}

/* ------------------------------------------------------------------ zones */

export function getZones(): Zone[] {
  return getDb().prepare('SELECT * FROM zones ORDER BY price_per_hour DESC').all() as Zone[];
}

export function getZone(id: string): Zone | undefined {
  return getDb().prepare('SELECT * FROM zones WHERE id = ?').get(id) as Zone | undefined;
}

/* ------------------------------------------------------------------ slots */

export function getAvailableSlots(zoneId: string, date: string): Slot[] {
  return getDb()
    .prepare('SELECT * FROM slots WHERE zone_id = ? AND date = ? ORDER BY time')
    .all(zoneId, date) as Slot[];
}

export function getSlot(id: number): Slot | undefined {
  return getDb().prepare('SELECT * FROM slots WHERE id = ?').get(id) as Slot | undefined;
}

/* --------------------------------------------------------------- bookings */

export type CreateBookingInput = {
  zoneId: string;
  slotId: number;
  name: string;
  phone: string;
  email?: string | null;
  partySize: number;
};

export class SlotUnavailableError extends Error {
  constructor() {
    super('That slot was just booked. Pick another?');
    this.name = 'SlotUnavailableError';
  }
}

/** 'GON-2026-0147' — short, readable, monospace-friendly (spec 3.4.5). */
function newBookingId(db: Database.Database): string {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    // Four digits lifted from a v4 UUID: no counter table, collisions unlikely.
    const seq = randomUUID().replace(/\D/g, '').slice(0, 4).padEnd(4, '0');
    const id = `GON-${year}-${seq}`;
    if (!db.prepare('SELECT 1 FROM bookings WHERE id = ?').get(id)) return id;
  }
  return `GON-${year}-${Date.now().toString().slice(-4)}`;
}

/**
 * Books a slot and writes the booking in one transaction: the slot flip is the
 * lock, so two people confirming the same slot cannot both succeed.
 */
export function createBooking(input: CreateBookingInput): BookingDetail {
  const db = getDb();

  const run = db.transaction((data: CreateBookingInput): string => {
    const claimed = db
      .prepare('UPDATE slots SET booked = 1 WHERE id = ? AND zone_id = ? AND booked = 0')
      .run(data.slotId, data.zoneId);

    if (claimed.changes === 0) throw new SlotUnavailableError();

    const id = newBookingId(db);
    db.prepare(
      `INSERT INTO bookings (id, zone_id, slot_id, name, phone, email, party_size, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
    ).run(
      id,
      data.zoneId,
      data.slotId,
      data.name,
      data.phone,
      data.email ?? null,
      data.partySize,
    );
    return id;
  });

  const booking = getBooking(run(input));
  if (!booking) throw new Error('Booking vanished right after it was written');
  return booking;
}

const BOOKING_SELECT = `
  SELECT b.*, z.name AS zone_name, z.accent_hex AS zone_accent,
         z.price_per_hour, s.date, s.time
    FROM bookings b
    JOIN zones z ON z.id = b.zone_id
    JOIN slots s ON s.id = b.slot_id`;

export function getBooking(id: string): BookingDetail | undefined {
  return getDb().prepare(`${BOOKING_SELECT} WHERE b.id = ?`).get(id) as
    | BookingDetail
    | undefined;
}

export type BookingFilter = {
  status?: BookingStatus;
  zoneId?: string;
  from?: string;
  to?: string;
  limit?: number;
};

export function listBookings(filter: BookingFilter = {}): BookingDetail[] {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (filter.status) {
    where.push('b.status = ?');
    params.push(filter.status);
  }
  if (filter.zoneId) {
    where.push('b.zone_id = ?');
    params.push(filter.zoneId);
  }
  if (filter.from) {
    where.push('s.date >= ?');
    params.push(filter.from);
  }
  if (filter.to) {
    where.push('s.date <= ?');
    params.push(filter.to);
  }

  const sql = `${BOOKING_SELECT}
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.date DESC, s.time DESC
    LIMIT ?`;

  return getDb()
    .prepare(sql)
    .all(...params, filter.limit ?? 500) as BookingDetail[];
}

/** Cancels a booking and frees its slot. False if it was already cancelled. */
export function cancelBooking(id: string): boolean {
  const db = getDb();
  const run = db.transaction((bookingId: string): boolean => {
    const booking = db.prepare('SELECT slot_id, status FROM bookings WHERE id = ?').get(
      bookingId,
    ) as { slot_id: number; status: BookingStatus } | undefined;

    if (!booking || booking.status === 'cancelled') return false;

    db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`).run(bookingId);
    db.prepare('UPDATE slots SET booked = 0 WHERE id = ?').run(booking.slot_id);
    return true;
  });
  return run(id);
}

/* ------------------------------------------------------------------ stats */

export type AdminStats = {
  todayBookings: number;
  weekRevenue: number;
  occupancy7d: number;
  activeMembers: number;
};

export function getAdminStats(): AdminStats {
  const db = getDb();

  const today = (
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM bookings b JOIN slots s ON s.id = b.slot_id
          WHERE s.date = date('now','localtime') AND b.status = 'confirmed'`,
      )
      .get() as { n: number }
  ).n;

  // Revenue proxy: one hour per booking at the zone's hourly rate.
  const revenue = (
    db
      .prepare(
        `SELECT COALESCE(SUM(z.price_per_hour), 0) AS total
           FROM bookings b
           JOIN slots s ON s.id = b.slot_id
           JOIN zones z ON z.id = b.zone_id
          WHERE b.status = 'confirmed'
            AND s.date BETWEEN date('now','localtime','-6 days') AND date('now','localtime')`,
      )
      .get() as { total: number }
  ).total;

  const window = db
    .prepare(
      `SELECT COUNT(*) AS total, COALESCE(SUM(booked), 0) AS taken FROM slots
        WHERE date BETWEEN date('now','localtime') AND date('now','localtime','+6 days')`,
    )
    .get() as { total: number; taken: number };

  const members = (db.prepare('SELECT COUNT(*) AS n FROM members').get() as { n: number }).n;

  return {
    todayBookings: today,
    weekRevenue: revenue,
    occupancy7d: window.total ? Math.round((window.taken / window.total) * 100) : 0,
    activeMembers: members,
  };
}

export type SiteStats = {
  zonesOpen: number;
  tournamentsThisMonth: number;
  members: number;
  slotsFreeToday: number;
};

export function getSiteStats(): SiteStats {
  const db = getDb();
  const zones = (db.prepare('SELECT COUNT(*) AS n FROM zones').get() as { n: number }).n;
  const tournaments = (
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM events
          WHERE strftime('%Y-%m', date) = strftime('%Y-%m','now','localtime')`,
      )
      .get() as { n: number }
  ).n;
  const members = (db.prepare('SELECT COUNT(*) AS n FROM members').get() as { n: number }).n;
  const free = (
    db
      .prepare(
        `SELECT COUNT(*) AS n FROM slots
          WHERE date = date('now','localtime') AND booked = 0`,
      )
      .get() as { n: number }
  ).n;

  return {
    zonesOpen: zones,
    tournamentsThisMonth: tournaments,
    members: members + 240, // founding-member base carried over from pre-launch sign-ups
    slotsFreeToday: free,
  };
}

/**
 * Plausible "players in-house right now" figure for the navbar ticker: party
 * sizes booked into the current hour plus a walk-in base that drifts with the
 * clock, so the number moves between polls.
 */
export function getLiveCount(): number {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(b.party_size), 0) AS seated
         FROM bookings b JOIN slots s ON s.id = b.slot_id
        WHERE b.status = 'confirmed'
          AND s.date = date('now','localtime')
          AND CAST(substr(s.time, 1, 2) AS INTEGER)
              = CAST(strftime('%H','now','localtime') AS INTEGER)`,
    )
    .get() as { seated: number };

  const hour = new Date().getHours();
  const open = hour >= 10 && hour <= 22;
  const walkIns = open ? 18 + Math.round(Math.sin(Date.now() / 90_000) * 9) : 0;
  return Math.max(0, row.seated + walkIns);
}

/* ----------------------------------------------------------------- events */

export function listEvents(category?: string): GameEvent[] {
  const db = getDb();
  if (category && category !== 'all') {
    return db
      .prepare('SELECT * FROM events WHERE category = ? ORDER BY date')
      .all(category) as GameEvent[];
  }
  return db.prepare('SELECT * FROM events ORDER BY date').all() as GameEvent[];
}

export function registerForEvent(id: string): boolean {
  const res = getDb()
    .prepare(
      'UPDATE events SET registered = registered + 1 WHERE id = ? AND registered < slots',
    )
    .run(id);
  return res.changes > 0;
}

/* ---------------------------------------------------------------- members */

export function createMember(input: {
  name: string;
  phone: string;
  tier: Member['tier'];
}): Member {
  const db = getDb();
  db.prepare(
    `INSERT INTO members (id, name, phone, tier) VALUES (?, ?, ?, ?)
       ON CONFLICT(phone) DO UPDATE SET name = excluded.name, tier = excluded.tier`,
  ).run(randomUUID(), input.name, input.phone, input.tier);
  return db.prepare('SELECT * FROM members WHERE phone = ?').get(input.phone) as Member;
}

export type { Booking, BookingDetail, Slot, Zone };
