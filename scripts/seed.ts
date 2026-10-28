import { loadEnvConfig } from '@next/env';

async function main() {
  loadEnvConfig(process.cwd());
  if (process.env.DATABASE_URL) {
    const { seedPostgres } = await import('../src/lib/seed-postgres');
    const { getPool } = await import('../src/lib/postgres');
    try {
      await seedPostgres();
      console.log('PostgreSQL venue data seeded');
    } finally {
      await getPool().end();
    }
  } else {
    if (process.env.VERCEL) throw new Error('DATABASE_URL is required on Vercel');
    const { ensureSeeded } = await import('../src/lib/seed');
    const { getDb } = await import('../src/lib/sqlite');
    ensureSeeded();
    console.log('Local SQLite demo database seeded');
    const db = getDb();
    for (const table of ['zones', 'slots', 'bookings', 'events', 'members']) {
      const row = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number };
      console.log(`${table}: ${row.n}`);
    }
    db.close();
  }
}
void main().catch(() => {
  console.error(
    'Seeding failed. Check your database configuration and run db:setup for a new Supabase project.',
  );
  process.exitCode = 1;
});
