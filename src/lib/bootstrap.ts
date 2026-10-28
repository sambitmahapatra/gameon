import { databaseConfigured, usesPostgres } from './db';
import { DatabaseConfigurationError } from './db-errors';

const state = globalThis as unknown as {
  gameonBootstrap?: { day: string; ready: Promise<void> };
};

export async function withDb<T>(fn: () => T | Promise<T>): Promise<T> {
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
