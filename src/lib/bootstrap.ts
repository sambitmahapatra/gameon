import { ensureSeeded } from './seed';

/**
 * Seeds the demo database the first time any server module needs it. Cached on
 * globalThis so Next.js dev reloads do not re-run it on every request.
 */
const globalForSeed = globalThis as unknown as { gameonSeeded?: boolean };

export function withDb<T>(fn: () => T): T {
  if (!globalForSeed.gameonSeeded) {
    ensureSeeded();
    globalForSeed.gameonSeeded = true;
  }
  return fn();
}
