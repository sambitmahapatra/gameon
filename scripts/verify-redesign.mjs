import assert from 'node:assert/strict';

// Mutates test data: deliberately limited to an isolated local preview.
const base = process.env.VERIFY_URL ?? 'http://localhost:3112';
assert(
  ['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname),
  'Use an isolated local server',
);
const post = (path, data) =>
  fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
for (const path of [
  '/images/club/hero.webp',
  '/images/club/console.webp',
  '/images/club/immersion.webp',
  '/images/club/racing.webp',
  '/images/club/flight.webp',
  '/images/club/arcade.webp',
  '/images/club/social.webp',
  '/images/club/burger.webp',
  '/images/club/sides.webp',
  '/images/club/pizza.webp',
  '/images/club/cooler.webp',
  '/fonts/barlow-condensed-800.ttf',
  '/fonts/barlow-condensed-900.ttf',
  '/fonts/dm-sans-variable.ttf',
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  assert((await response.arrayBuffer()).byteLength > 1000, path);
}
console.log('All reference images and local fonts served successfully');
const invalid = await post('/api/members', { name: 'QA', phone: '123', tier: 'silver' });
assert.equal(invalid.status, 422);
for (const tier of ['bronze', 'silver', 'gold']) {
  const response = await post('/api/members', {
    name: 'Redesign QA',
    phone: `9${String(Date.now()).slice(-8)}${['bronze', 'silver', 'gold'].indexOf(tier)}`,
    tier,
  });
  assert.equal(response.status, 201, await response.clone().text());
  assert.equal((await response.json()).member.tier, tier);
}
console.log('Bronze, Silver and Gold registrations persist through the member API');
const { events } = await (await fetch(base + '/api/events')).json();
const event = events.find((e) => e.registered < e.slots);
assert(event, 'An event with availability');
const response = await post('/api/events', { eventId: event.id });
assert.equal(response.status, 200);
const after = await (await fetch(base + '/api/events')).json();
assert.equal(
  after.events.find((e) => e.id === event.id).registered,
  event.registered + 1,
);
console.log('Event registration updates the live calendar');
const cssHtml = await (await fetch(base)).text();
assert.match(cssHtml, /club-booking-form/);
assert.match(cssHtml, /Switch to|Toggle theme/);
assert.match(cssHtml, /₹999|999/);
assert.match(cssHtml, /2,499/);
assert.match(cssHtml, /4,999/);
for (const category of ['snacks', 'mains', 'combos', 'drinks']) {
  const r = await fetch(base + '/menu?category=' + category);
  assert.equal(r.status, 200);
}
console.log('Home content, membership prices and all menu deep links verified');
