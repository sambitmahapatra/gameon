/**
 * Static export for the Capacitor APK wrap.
 *
 * A static export cannot contain route handlers, so this script moves
 * src/app/api aside, builds with NEXT_OUTPUT=export, then puts it back — the
 * exported bundle talks to a hosted backend through NEXT_PUBLIC_API_BASE.
 *
 *   npm run build:static
 *
 * Restores src/app/api even when the build fails, so a broken build never
 * leaves the repo without its API routes.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

/**
 * Server-only routes: API handlers, the staff dashboard and private booking
 * confirmations. Booking IDs are created at runtime and must never be exported.
 */
const PARKED = [
  {
    live: path.join(root, 'src', 'app', 'api'),
    aside: path.join(root, '.export-parked-api'),
  },
  {
    live: path.join(root, 'src', 'app', 'admin'),
    aside: path.join(root, '.export-parked-admin'),
  },
  {
    live: path.join(root, 'src', 'app', 'book', 'confirm'),
    aside: path.join(root, '.export-parked-confirm'),
  },
];

for (const entry of PARKED) {
  if (fs.existsSync(entry.aside)) {
    console.error(
      `Found ${entry.aside} from an interrupted export. Restore it to ${entry.live} before retrying.`,
    );
    process.exit(1);
  }
}

const moved = PARKED.filter((entry) => fs.existsSync(entry.live));
const parked = [];

try {
  for (const entry of moved) {
    fs.renameSync(entry.live, entry.aside);
    parked.push(entry);
  }
} catch (error) {
  // Windows refuses to rename a directory a watcher is holding, which in
  // practice means `npm run dev` is still running.
  for (const entry of parked.reverse()) fs.renameSync(entry.aside, entry.live);
  if (error.code === 'EPERM' || error.code === 'EBUSY') {
    console.error(
      `Could not move ${error.path} aside: something is holding it open. ` +
        'Stop the dev server (npm run dev) and run this again.',
    );
    process.exit(1);
  }
  throw error;
}

try {
  const result = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, NEXT_OUTPUT: 'export' },
  });
  process.exitCode = result.status ?? 1;
} finally {
  for (const entry of moved) fs.renameSync(entry.aside, entry.live);
}

if (process.exitCode === 0) {
  console.log('\nStatic export written to ./out');
  console.log('Set NEXT_PUBLIC_API_BASE to the hosted origin before building the APK.');
}
