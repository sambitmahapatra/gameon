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
 * Routes that cannot exist in the export: API handlers, and the staff dashboard
 * (it reads searchParams, and a floor tool has no place inside the app anyway).
 */
const PARKED = [
  { live: path.join(root, 'src', 'app', 'api'), aside: path.join(root, '.export-parked-api') },
  {
    live: path.join(root, 'src', 'app', 'admin'),
    aside: path.join(root, '.export-parked-admin'),
  },
];

for (const entry of PARKED) {
  if (fs.existsSync(entry.aside)) {
    console.error(
      `Found ${path.basename(entry.aside)} from an interrupted run. Move it back to ${
        entry.live
      } before retrying.`,
    );
    process.exit(1);
  }
}

const moved = PARKED.filter((entry) => fs.existsSync(entry.live));
for (const entry of moved) fs.renameSync(entry.live, entry.aside);

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
