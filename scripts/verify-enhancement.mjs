import assert from 'node:assert/strict';

// Run against the isolated verification server, never the user's active DB.
const base = process.env.VERIFY_URL ?? 'http://localhost:3100';
async function request(path, init) {
  const response = await fetch(base + path, init);
  return { response, text: await response.text() };
}
for (const path of [
  '/',
  '/menu',
  '/membership',
  '/book',
  '/events',
  '/zones/vr-arena',
  '/zones/flight-sim',
  '/zones/racing-cockpit',
  '/zones/esports-station',
  '/zones/console-lounge',
  '/zones/streaming-pod',
]) {
  const { response, text } = await request(path);
  assert.equal(response.status, 200, path);
  assert.match(text, /<title>GameOn/);
  console.log(`200 ${path}`);
}
const home = (await request('/')).text;
assert.match(home, /club-plan--popular/);
assert.match(home, /Play Beyond Ordinary/);
assert.match(home, /Book your gaming session/);
assert.match(home, /Arcade Corner/);
assert.match(home, /Private Takeover/);
const missing = await request('/this-world-does-not-exist');
assert.equal(missing.response.status, 404);
assert.match(missing.text, /This world doesn/);
const { zones } = await fetch(base + '/api/zones').then((r) => r.json());
const date = new Date();
date.setDate(date.getDate() + 1);
const key = [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');
const zone = zones[0];
const { slots } = await fetch(`${base}/api/slots?zoneId=${zone.id}&date=${key}`).then(
  (r) => r.json(),
);
const slot = slots.find((s) => !s.booked);
assert(slot, 'An available test slot');
const details = {
  zoneId: zone.id,
  slotId: slot.id,
  name: 'Enhancement QA',
  phone: '9000000000',
  partySize: 1,
};
const invalid = await request('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...details, phone: '123' }),
});
assert.equal(invalid.response.status, 422);
const created = await request('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(details),
});
assert.equal(created.response.status, 201, created.text);
const { booking } = JSON.parse(created.text);
try {
  const confirmation = await request(`/book/confirm/${booking.id}`);
  assert.equal(confirmation.response.status, 200);
  assert.match(confirmation.text, /QR code for booking/);
  assert.match(confirmation.text, /data-qr-module/);
  assert.match(confirmation.text, /Reserved/);
  const conflict = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
  assert.equal(conflict.response.status, 409);
} finally {
  const cancelled = await request(`/api/bookings/${booking.id}`, { method: 'DELETE' });
  assert.equal(cancelled.response.status, 200);
}
console.log(
  'Booking: validation → available slot → create → confirmation QR → conflict → cancel passed',
);
