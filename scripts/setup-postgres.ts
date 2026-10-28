import { readFile } from 'node:fs/promises';
import { loadEnvConfig } from '@next/env';

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.DATABASE_URL)
    throw new Error(
      'Set DATABASE_URL in .env.local to your Supabase transaction-pooler URL first.',
    );
  const { getPool } = await import('../src/lib/postgres');
  const pool = getPool();
  try {
    const migration = await readFile(
      new URL('./migrations/001-postgres.sql', import.meta.url),
      'utf8',
    );
    // All migration statements, including BEGIN/COMMIT, share one connection.
    const client = await pool.connect();
    try {
      await client.query(migration);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    const { seedPostgres } = await import('../src/lib/seed-postgres');
    await seedPostgres();
    console.log(
      'PostgreSQL schema and venue data are ready. Existing bookings and members were preserved.',
    );
  } finally {
    await pool.end();
  }
}
void main().catch(() => {
  console.error(
    'Database setup failed. Check DATABASE_URL, connectivity, SSL settings and database-owner permissions. No credentials were logged.',
  );
  process.exitCode = 1;
});
