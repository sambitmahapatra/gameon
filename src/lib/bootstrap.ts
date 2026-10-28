import { databaseConfigured, usesPostgres } from './db';
import { DatabaseConfigurationError } from './db-errors';
import { unstable_noStore as noStore } from 'next/cache';
import { isStaticExport } from './render-mode';

const state = globalThis as unknown as {
  gameonBootstrap?: { day: string; ready: Promise<void> };
};

export async function withDb<T>(fn: () => T | Promise<T>): Promise<T> {
  // Next 14 does not statically analyze our re-exported route configuration.
  // Opt out at the data boundary before opening a connection or seeding slots.
  if (!isStaticExport) noStore();
  if (!databaseConfigured()) throw new DatabaseConfigurationError();
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(
    new Date(),
  );
  if (state.gameonBootstrap?.day !== day) {
    const ready = usesPostgres()
      ? import('./postgres').then((db) => db.ensureFutureSlots())
      : import('./seed').then((db) => db.ensureSeeded());
    const entry = { day, ready };
    state.gameonBootstrap = entry;
    void ready.catch(() => {
      if (state.gameonBootstrap === entry) state.gameonBootstrap = undefined;
    });
  }
  await state.gameonBootstrap!.ready;
  return await fn();
}
