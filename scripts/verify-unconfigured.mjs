import assert from 'node:assert/strict';
import fs from 'node:fs';

// Against VERCEL=1, DATABASE_URL unset, with DATABASE_PATH pointing at this
// deliberately absent location. No SQLite fallback is allowed in this mode.
const base = process.env.VERIFY_URL ?? 'http://localhost:3102';
for (const path of [
  '/',
  '/menu',
  '/membership',
  '/events',
  '/book',
  '/zones/vr-arena',
  '/zones/flight-sim',
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert(!html.includes('Something broke on our end'), path);
  if (path === '/') assert(html.includes('GameOn. Enter another world.'));
  if (path === '/book')
    assert(html.includes('Online reservations will be available soon'));
}
for (const path of [
  '/api/zones',
  '/api/live-count',
  '/api/slots?zoneId=vr-arena&date=2026-10-29',
  '/api/events',
  '/api/stats',
  '/api/bookings',
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 503, path);
  const data = await response.json();
  assert.match(data.error, /temporarily unavailable/);
}
for (const path of ['/api/bookings', '/api/members', '/api/events']) {
  const response = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  assert.equal(response.status, 503, path);
}
assert(
  !fs.existsSync('.cache/must-not-create'),
  'Vercel mode attempted local filesystem initialization',
);
console.log(
  'Unconfigured Vercel mode passed: public pages 200, unavailable APIs 503, no SQLite directory created.',
);
