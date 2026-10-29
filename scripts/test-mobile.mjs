import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const html = await readFile('GameON application/GameOn App.html', 'utf8');
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const catalog = JSON.parse(code.slice('const CATALOG = '.length, code.indexOf(';\n')));
const core = vm.runInNewContext(
  (await readFile('mobile/gameon/core.js', 'utf8')) + ';Core;',
  { Date, Set, Number, Object, Array, String, Math },
);
const hash = createHash('sha256').update(code).digest('base64');
assert(html.includes(`script-src 'sha256-${hash}'`));
assert(html.includes("connect-src 'none'"));
assert(
  !/<(?:script|img|link)[^>]+(?:src|href)=["']https?:/i.test(html),
  'All runtime assets are embedded',
);
assert.equal(catalog.zones.length, 7);
assert.equal(catalog.menu.length, 24);
assert(catalog.zones.every((z) => z.image.startsWith('data:image/webp;base64,')));
assert(catalog.menu.every((z) => z.image.startsWith('data:image/webp;base64,')));
const clean = core.normalize(
  {
    theme: 'bad',
    favorites: ['console-lounge', 'bogus', 'console-lounge'],
    bag: { 'masala-fries': 200, bogus: 1 },
    plans: [null, { id: 'invalid' }],
  },
  catalog,
);
assert.equal(clean.theme, 'system');
assert.equal(clean.favorites.length, 1);
assert.equal(clean.bag['masala-fries'], 20);
assert.equal(clean.plans.length, 0);
const bag = { 'masala-fries': 2, 'post-game-burger': 1 };
assert.equal(core.foodTotal(bag, catalog.menu).total, 360);
assert.equal(core.foodTotal(bag, catalog.menu).unknown, 1);
const tomorrow = '2030-01-02',
  now = new Date('2030-01-01T12:00:00');
const plan = {
  zoneId: 'console-lounge',
  date: tomorrow,
  time: '18:00',
  hours: 1.5,
  players: 2,
  note: 'Crew night',
  food: bag,
};
assert.equal(core.validatePlan(plan, catalog, now), '');
assert.equal(core.estimate(plan, catalog).total, 885);
assert.match(core.validatePlan({ ...plan, time: '21:30' }, catalog, now), /finish by/);
assert.match(
  core.validatePlan({ ...plan, zoneId: 'flight-sim', players: 3 }, catalog, now),
  /capacity/,
);
assert.match(core.validatePlan({ ...plan, date: '2020-01-01' }, catalog, now), /future/);
assert.match(core.validatePlan({ ...plan, date: '2030-02-31' }, catalog, now), /future/);
const timer = core.startTimer(30, 1000);
assert.equal(core.remaining(timer, 61000), 1740000);
const paused = core.toggleTimer(timer, 61000);
assert.equal(core.remaining(paused, 99999999), 1740000);
const resumed = core.toggleTimer(paused, 100000);
assert.equal(core.remaining(resumed, 160000), 1680000);
assert.equal(core.remaining(resumed, 99999999), 0);
console.log(
  'Offline core passed: state recovery, shared catalogue, estimates, unknown prices, capacity, dates, closing time, timer pause/resume and expiry',
);

const { parseHTML } =
  await import('../.cache/mobile-test-deps/node_modules/linkedom/esm/index.js');
const store = new Map();
function harness() {
  const { window } = parseHTML(html);
  window.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, v),
  };
  window.matchMedia = () => ({ matches: true, addEventListener() {} });
  window.location = {
    hash: '',
    href: 'https://appassets.androidplatform.net/assets/index.html',
  };
  window.history = { replaceState() {} };
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'GameOn DOM test' } });
  window.setInterval = () => 0;
  window.setTimeout = () => 0;
  window.clearTimeout = () => {};
  const dialog = window.document.querySelector('#sheet');
  Object.defineProperty(dialog, 'open', {
    get() {
      return this.hasAttribute('open');
    },
  });
  dialog.showModal = function () {
    this.setAttribute('open', '');
  };
  dialog.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new window.Event('close'));
  };
  // Linkedom has no layout, native select defaulting or checkbox property reflection.
  Object.defineProperty(window.HTMLSelectElement.prototype, 'value', {
    configurable: true,
    get() {
      const option =
        this.querySelector('option[selected]') || this.querySelector('option');
      return option?.getAttribute('value') ?? option?.textContent ?? '';
    },
    set(value) {
      this.querySelectorAll('option').forEach((o) =>
        o.toggleAttribute('selected', o.getAttribute('value') === String(value)),
      );
    },
  });
  Object.defineProperty(window.HTMLInputElement.prototype, 'checked', {
    configurable: true,
    get() {
      return this.hasAttribute('checked');
    },
    set(value) {
      this.toggleAttribute('checked', value);
    },
  });
  const context = vm.createContext(window);
  vm.runInContext(code, context);
  const $ = (s) => window.document.querySelector(s);
  const click = (s) => {
    const el = $(s);
    assert(el, 'Missing control: ' + s);
    el.dispatchEvent(new window.Event('click', { bubbles: true }));
  };
  return { window, $, click, context };
}
let app = harness();
assert.equal(app.$('#main').querySelectorAll('.zone').length, 7);
app.click('[data-favorite="console-lounge"]');
assert.equal(
  app.$('[data-favorite="console-lounge"]').getAttribute('aria-pressed'),
  'true',
);
app.click('[data-filter="saved"]');
assert.equal(app.$('#main').querySelectorAll('.zone').length, 1);
app.click('[data-go="cafe"]');
app.click('[data-category="snacks"]');
app.$('#food-search').value = 'Masala';
app.$('#food-search').dispatchEvent(new app.window.Event('input', { bubbles: true }));
assert.equal(app.$('#food-results').querySelectorAll('.food').length, 1);
app.click('[data-qty="masala-fries"]');
assert(app.$('.list-summary').textContent.includes('1 item'));
app.click('[data-action="bag"]');
assert(app.$('#sheet').open);
app.click('[data-action="new-plan"]');
assert(app.$('#plan-food').checked, 'Café list included in a new plan');
app.$('#plan-date').value = tomorrow;
app.$('#plan-note').value = '<img src=x onerror=alert(1)>';
app
  .$('#plan-form')
  .dispatchEvent(new app.window.Event('submit', { bubbles: true, cancelable: true }));
assert.equal(app.$('#main').querySelectorAll('.plan-card').length, 1);
assert(!app.$('.plan-card').querySelector('img'), 'User notes are escaped');
assert(app.$('.plan-card').textContent.includes('Not booked'));
app.click('[data-edit-plan]');
app.$('#plan-hours').value = '2';
app.$('#plan-note').value = 'Crew update';
app
  .$('#plan-form')
  .dispatchEvent(new app.window.Event('submit', { bubbles: true, cancelable: true }));
assert(app.$('.plan-card').textContent.includes('2 hours'));
assert(app.$('.plan-card').textContent.includes('Crew update'));
app.click('[data-start-plan]');
assert(app.$('#sheet-content').textContent.includes('Your session timer'));
app.click('[data-action="toggle-timer"]');
assert(app.$('#timer-status').textContent.includes('Paused'));
assert.equal(app.window.gameonBack(), true);
assert.equal(app.$('#sheet').open, false);
app.click('[data-go="visit"]');
app.click('[data-theme-choice="light"]');
assert.equal(app.window.document.documentElement.dataset.theme, 'light');
// A new document simulates app restart, using only local storage.
app = harness();
assert.equal(app.window.document.documentElement.dataset.theme, 'light');
assert.equal(
  app.$('[data-favorite="console-lounge"]').getAttribute('aria-pressed'),
  'true',
);
app.click('[data-go="plans"]');
assert.equal(app.$('#main').querySelectorAll('.plan-card').length, 1);
assert(app.$('.timer-strip').textContent.includes('Paused'));
app.click('[data-share-plan]');
assert(app.$('#share-copy').textContent.includes('not a confirmed booking'));
app.window.gameonBack();
app.click('[data-delete-plan]');
app.click('[data-confirm="delete"]');
assert.equal(app.$('#main').querySelectorAll('.plan-card').length, 0);
app.click('[data-go="visit"]');
app.click('[data-action="reset"]');
app.click('[data-confirm="reset"]');
app = harness();
assert.equal(
  app.$('[data-favorite="console-lounge"]').getAttribute('aria-pressed'),
  'false',
);
app.click('[data-go="plans"]');
assert.equal(app.$('#main').querySelectorAll('.timer-strip').length, 0);
console.log(
  'Offline UI passed: navigation, favourites, café shortlist, plan creation, escaped notes, timer, sharing, theme, restart persistence and plan removal',
);
console.log(
  'HTML CSP hash and embedded assets verified. This DOM test does not replace physical Android device testing.',
);
