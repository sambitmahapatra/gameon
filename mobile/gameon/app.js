/* Everything in this app stays on this device. No fetch, analytics or API client. */
const ICONS = {
  play: '<rect x="2" y="6" width="20" height="13" rx="4"/><path d="M7 10v5m-2.5-2.5h5M16 11h.01M18 14h.01"/>',
  food: '<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 21V3c-4 2-4 8 0 9"/>',
  plan: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-11 5 2 2 4-4"/>',
  visit: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  up: '<path d="M6 18 18 6M6 6h12v12"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  moon: '<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3m6 0 2 2"/>',
  search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  users:
    '<circle cx="9" cy="8" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3m1-16a3 3 0 0 1 0 6m3 10v-3a7 7 0 0 0-3-6"/>',
  share:
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="m4 3 4 1 1 5-2 2c1.8 3 3 4.2 6 6l2-2 5 1 1 4c-8 3-20-9-17-17Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  pause: '<path d="M8 5v14m8-14v14"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.play}</svg>`;
const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const money = (number) =>
  '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(number);
const $ = (selector) => document.querySelector(selector),
  main = $('#main'),
  sheet = $('#sheet');
const STORAGE = 'gameon-offline-v1';
let state = Core.empty(),
  tab = 'play',
  onlyFavorites = false,
  category = 'all',
  search = '',
  sheetKind = '',
  editorId = null,
  focusBefore = null,
  toastId = null;
try {
  state = Core.normalize(JSON.parse(localStorage.getItem(STORAGE) || 'null'), CATALOG);
} catch {}
function persist() {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(state));
    return true;
  } catch {
    toast(
      'Device storage is unavailable. Changes will last only while this app is open.',
    );
    return false;
  }
}
function toast(message) {
  clearTimeout(toastId);
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  toastId = setTimeout(() => $('#toast').classList.remove('show'), 3500);
}
function currentTheme() {
  return state.theme === 'system'
    ? matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : state.theme;
}
function applyTheme() {
  document.documentElement.dataset.theme = currentTheme();
  $('#theme-button').innerHTML = icon(currentTheme() === 'dark' ? 'sun' : 'moon');
  $('#theme-button').setAttribute(
    'aria-label',
    currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );
  document.querySelector('meta[name="theme-color"]').content =
    currentTheme() === 'dark' ? '#0b0c10' : '#f6f7ee';
}
function setTheme(theme) {
  state.theme = theme;
  persist();
  applyTheme();
  if (tab === 'visit') render(false);
}
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return Core.dateKey(date);
};
function dayLabel(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
function timeLabel(time) {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
function timerValue() {
  const seconds = Math.ceil(Core.remaining(state.timer) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
function timerStrip() {
  return state.timer
    ? `<button class="timer-strip" data-action="timer">${icon('timer')}<div><strong>Session timer</strong><small>${Core.remaining(state.timer) === 0 ? 'Time for a break' : state.timer.running ? 'Running on this device' : 'Paused'}</small></div><span data-timer>${timerValue()}</span></button>`
    : '';
}
function badgeCount() {
  return state.plans.length;
}
function nav() {
  const count = badgeCount();
  $('#nav').innerHTML = [
    ['play', 'play', 'Play'],
    ['cafe', 'food', 'Café'],
    ['plans', 'plan', 'My plans'],
    ['visit', 'visit', 'Club'],
  ]
    .map(
      ([key, glyph, label]) =>
        `<button data-go="${key}" ${key === tab ? 'aria-current="page"' : ''}>${icon(glyph)}${key === 'plans' && count ? `<span class="nav-badge">${count}</span>` : ''}<span>${label}</span></button>`,
    )
    .join('');
}
function go(next) {
  if (!['play', 'cafe', 'plans', 'visit'].includes(next)) return;
  closeSheet();
  tab = next;
  render(true);
  try {
    history.replaceState(null, '', '#' + next);
  } catch {}
}
function zoneCard(zone) {
  const saved = state.favorites.includes(zone.id);
  return `<article class="zone"><button class="zone-open" data-zone="${esc(zone.id)}" aria-label="Explore ${esc(zone.name)}"><div class="zone-photo"><img src="${zone.image}" alt="${esc(zone.name)}" loading="lazy"></div><div class="zone-body"><h3>${esc(zone.name)}</h3><div class="zone-price">${zone.price === null ? 'Ask at counter' : money(zone.price) + ' <small>/ hour</small>'}</div><div class="zone-meta">${zone.capacity ? 'Up to ' + zone.capacity + ' players' : 'Casual, pay-per-play'} · ${esc(zone.tag)}</div></div></button><button class="favorite" data-favorite="${esc(zone.id)}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${esc(zone.name)}">${icon('heart')}</button></article>`;
}
function playView() {
  const zones = CATALOG.zones.filter(
    (z) => !onlyFavorites || state.favorites.includes(z.id),
  );
  return `${timerStrip()}<div class="eyebrow">Your club. In your pocket.</div><h1>What are we<br>playing today?</h1><p class="intro">Pick your experience. Bring your people.<br>Make a little more time for play.</p>${!onlyFavorites ? `<div class="hero"><img src="${CATALOG.hero}" alt="GameOn gaming arena"><span class="hero-label">${icon('bolt')} PLAY · EAT · REPEAT</span><div class="eyebrow">A different kind of night</div><h2>Less scrolling.<br><em>More playing.</em></h2><p>Find your game and put your next session on the calendar.</p><button class="btn" data-action="new-plan">Make a plan ${icon('arrow')}</button></div><div class="quick-row"><button data-go="cafe">${icon('food')} Café list</button><button data-action="timer">${icon('timer')} Timer</button><button data-go="visit">${icon('pin')} Visit us</button></div>` : ''}<div class="section-title"><h2>${onlyFavorites ? 'Your favourites' : 'Find your player mode'}</h2><span>${zones.length} experiences</span></div><div class="chips"><button class="chip" data-filter="all" aria-pressed="${!onlyFavorites}">All experiences</button><button class="chip" data-filter="saved" aria-pressed="${onlyFavorites}">Saved · ${state.favorites.length}</button></div>${zones.length ? `<div class="zone-grid">${zones.map(zoneCard).join('')}</div>` : `<div class="empty">${icon('heart')}<h2>Your next favourites.</h2><p>Tap the heart on an experience to keep it here for next time.</p><button class="btn ghost" data-filter="all">Explore all experiences</button></div>`}<p class="end-note">Catalogue prices are saved offline. Confirm rates and availability at the counter.</p>`;
}
function quantity(item) {
  const q = state.bag[item.slug] || 0;
  return q
    ? `<div class="qty"><button data-qty="${esc(item.slug)}" data-delta="-1" aria-label="Remove one ${esc(item.name)}">−</button><output aria-label="Quantity">${q}</output><button data-qty="${esc(item.slug)}" data-delta="1" ${q >= 20 ? 'disabled' : ''} aria-label="Add one ${esc(item.name)}">+</button></div>`
    : `<button class="add-btn" data-qty="${esc(item.slug)}" data-delta="1" aria-label="Add ${esc(item.name)} to café list">ADD +</button>`;
}
function foodCard(item) {
  return `<article class="food"><img src="${item.image}" alt="${esc(item.name)}" loading="lazy"><div class="food-info"><h3>${item.veg !== null ? `<i class="diet ${item.veg ? '' : 'nonveg'}" title="${item.veg ? 'Vegetarian' : 'Contains chicken'}"></i>` : ''}${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="food-bottom"><span class="food-price">${item.price === null ? 'Ask at counter' : money(item.price)}</span>${quantity(item)}</div></div></article>`;
}
function foodResults() {
  const term = search.trim().toLowerCase(),
    items = CATALOG.menu.filter(
      (f) =>
        (category === 'all' || f.category === category) &&
        (!term || (f.name + ' ' + f.description).toLowerCase().includes(term)),
    );
  return items.length
    ? items.map(foodCard).join('')
    : `<div class="empty">${icon('search')}<h2>No bites found.</h2><p>Try another search or food category.</p></div>`;
}
function foodSummary() {
  const cost = Core.foodTotal(state.bag, CATALOG.menu);
  return cost.count
    ? `<button class="list-summary" data-action="bag"><div><b>${cost.count} ${cost.count === 1 ? 'item' : 'items'} on your café list</b><small>${money(cost.total)}${cost.unknown ? ' + items priced at counter' : ''} · Not an order</small></div>${icon('arrow')}</button>`
    : '';
}
function cafeView() {
  return `<div class="eyebrow">Between rounds</div><h1>Good game.<br>Great food.</h1><p class="intro">Build your refuel list before you arrive.<br>Nothing is ordered or charged in this app.</p><div class="search">${icon('search')}<input id="food-search" type="search" placeholder="Find your next refuel" value="${esc(search)}" aria-label="Search café menu"></div><div class="chips">${[['all', 'All'], ...CATALOG.categories.map((c) => [c.id, c.label])].map(([id, label]) => `<button class="chip" data-category="${id}" aria-pressed="${category === id}">${esc(label)}</button>`).join('')}</div><div class="food-list" id="food-results">${foodResults()}</div><div id="food-summary">${foodSummary()}</div>`;
}
function planCard(plan) {
  const zone = CATALOG.zones.find((z) => z.id === plan.zoneId),
    cost = Core.estimate(plan, CATALOG);
  return `<article class="plan-card"><span class="local-tag">Saved on this device · Not booked</span><div class="plan-top"><div><h3>${esc(zone.name)}</h3><p class="plan-date">${esc(dayLabel(plan.date))} · ${esc(timeLabel(plan.time))}</p></div><strong class="plan-cost">${cost.unknown ? '~ ' : ''}${money(cost.total)}</strong></div><div class="plan-details"><span>${icon('timer')}${plan.hours} ${plan.hours === 1 ? 'hour' : 'hours'}</span><span>${icon('users')}${plan.players} ${plan.players === 1 ? 'player' : 'players'}</span>${cost.count ? `<span>${icon('food')}${cost.count} café items</span>` : ''}</div>${plan.note ? `<p class="plan-note">${esc(plan.note)}</p>` : ''}${cost.unknown ? '<p class="plan-note">Some items need a counter quote and are excluded from this estimate.</p>' : ''}<div class="plan-actions"><button class="btn ghost" data-edit-plan="${esc(plan.id)}">Edit plan</button><button class="btn" data-start-plan="${esc(plan.id)}">${icon('timer')} Start timer</button><button class="icon-btn" data-share-plan="${esc(plan.id)}" aria-label="Share ${esc(zone.name)} plan">${icon('share')}</button><button class="icon-btn" data-delete-plan="${esc(plan.id)}" aria-label="Delete ${esc(zone.name)} plan">${icon('trash')}</button></div></article>`;
}
function plansView() {
  return `${timerStrip()}<div class="eyebrow">More play. Less planning.</div><h1>Your next<br>good night.</h1><p class="intro">Save a session idea, check the budget and share it with your crew. Plans don’t reserve a slot.</p><button class="btn" style="margin-top:22px;width:100%" data-action="new-plan">${icon('plus')} Create a session plan</button>${
    state.plans.length
      ? state.plans
          .slice()
          .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
          .map(planCard)
          .join('')
      : `<div class="empty">${icon('plan')}<h2>A plan worth<br>looking forward to.</h2><p>Your saved sessions live here, ready when the group chat finally agrees.</p><button class="btn ghost" data-action="new-plan">Plan your first session ${icon('arrow')}</button></div>`
  }<div class="notice"><strong>Local plans, not reservations.</strong> This offline app can’t check availability or take payments. Confirm your preferred slot with the GameOn team.</div>`;
}
function visitView() {
  return `<div class="eyebrow">The gaming social club</div><h1>Play. Eat.<br>Repeat.</h1><div class="profile-banner"><h2>Come for the game.<br>Stay for the people.</h2><p>Your games, favourites and plans, together in one offline companion. No account. No sign-in. Just play.</p></div><section class="info-card"><h3>Find your people.</h3><p>${esc(CATALOG.site.address)}</p><div class="info-row"><strong>Opening hours</strong><span>10 AM – 10 PM, daily</span></div><div class="link-row"><a class="btn" href="${esc(CATALOG.site.mapsUrl)}">${icon('pin')} Directions</a><a class="btn ghost" href="tel:${esc(CATALOG.site.phone)}">${icon('phone')} Call the club</a></div><p style="font-size:9px;margin-bottom:0">Directions open your maps/browser app and may need internet.</p></section><section class="info-card"><h3>Your club level.</h3><p>Compare memberships for your next visit. Activation and payment happen at the counter.</p>${CATALOG.tiers
    .filter((t) => t.id !== 'walk-in')
    .map(
      (t) =>
        `<div class="member-row"><div><strong>${esc(t.name)}${t.popular ? ' · Community favourite' : ''}</strong><p>${esc(t.highlights[0].strong || '')} ${esc(t.highlights[0].text)}</p></div><b>${money(t.price)}<small>/mo</small></b></div>`,
    )
    .join(
      '',
    )}</section><section class="info-card"><h3>Make it yours.</h3><p>Choose your appearance.</p><div class="theme-choices">${['system', 'dark', 'light'].map((t) => `<button data-theme-choice="${t}" aria-pressed="${state.theme === t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div><div class="info-row" style="margin-top:16px"><strong>Session timer</strong><button class="text-link" data-action="timer">Open timer ${icon('arrow')}</button></div><div class="info-row"><strong>Saved locally</strong><span>${state.plans.length} plans · ${state.favorites.length} favourites</span></div><button class="text-link" data-action="reset" style="color:var(--danger)">Reset this device’s app data</button></section><p class="version">GAMEON OFFLINE · v1.0.0<br>Catalogue bundled ${esc(CATALOG.date)} · No tracking or API calls</p>`;
}
function render(scroll = false) {
  const top = main.scrollTop;
  main.innerHTML = `<div class="page-enter">${{ play: playView, cafe: cafeView, plans: plansView, visit: visitView }[tab]()}</div>`;
  nav();
  main.scrollTop = scroll ? 0 : top;
}
function openSheet(content, kind) {
  focusBefore = document.activeElement;
  sheetKind = kind;
  $('#sheet-content').innerHTML = content;
  $('#sheet-close').innerHTML = icon('close');
  sheet.scrollTop = 0;
  if (!sheet.open) sheet.showModal();
}
function closeSheet() {
  if (sheet.open) sheet.close();
  sheetKind = '';
  if (focusBefore?.isConnected) focusBefore.focus();
}
function zoneDetail(id) {
  const zone = CATALOG.zones.find((z) => z.id === id);
  if (!zone) return;
  openSheet(
    `<img class="sheet-image" src="${zone.image}" alt="${esc(zone.name)}"><div class="eyebrow">Find your player mode</div><h2 id="sheet-title">${esc(zone.name)}</h2><p class="detail-description">${esc(zone.description)}</p><div class="detail-tags">${zone.games.map((g) => `<span>${esc(g)}</span>`).join('')}</div><div class="detail-price"><div><strong>${zone.price === null ? 'Counter pricing' : money(zone.price)}${zone.price === null ? '' : '<small> / hour per zone</small>'}</strong><p class="muted" style="font-size:10px;margin-top:6px">${zone.capacity ? 'Up to ' + zone.capacity + ' players' : 'Check game availability at the counter'}</p></div></div><button class="btn" style="width:100%" data-plan-zone="${esc(zone.id)}">Add to my session plan ${icon('arrow')}</button><p class="end-note">An offline plan doesn’t reserve this experience.</p>`,
    'zone',
  );
}
function newPlan(zoneId = null, id = null) {
  const saved = state.plans.find((p) => p.id === id);
  editorId = saved?.id || null;
  const plan = saved || {
    zoneId: zoneId || 'console-lounge',
    date: tomorrow(),
    time: '18:00',
    hours: 1,
    players: 1,
    note: '',
    food: { ...state.bag },
  };
  openSheet(
    `<div class="eyebrow">A little planning. A lot of play.</div><h2 id="sheet-title">${saved ? 'Edit your' : 'Plan your'} session.</h2><p class="sheet-intro">Save the idea here. Confirm availability and final prices with the club when you’re ready.</p><form id="plan-form" class="form-grid"><div class="field full"><label for="plan-zone">Experience</label><select id="plan-zone" name="zoneId">${CATALOG.zones.map((z) => `<option value="${z.id}" ${z.id === plan.zoneId ? 'selected' : ''}>${esc(z.name)} · ${z.price === null ? 'Counter quote' : money(z.price) + '/hr'}</option>`).join('')}</select></div><div class="field"><label for="plan-date">Preferred date</label><input id="plan-date" name="date" type="date" value="${esc(plan.date)}" min="${Core.dateKey()}" required></div><div class="field"><label for="plan-time">Preferred time</label><input id="plan-time" name="time" type="time" value="${esc(plan.time)}" min="10:00" max="21:30" step="1800" required></div><div class="field"><label for="plan-hours">Duration</label><select id="plan-hours" name="hours">${[0.5, 1, 1.5, 2, 3].map((h) => `<option value="${h}" ${h === plan.hours ? 'selected' : ''}>${h === 0.5 ? '30 minutes' : h + ' ' + (h === 1 ? 'hour' : 'hours')}</option>`).join('')}</select></div><div class="field"><label for="plan-players">Players</label><select id="plan-players" name="players"></select></div><div class="field full"><label for="plan-note">Crew note <span>(optional, only on this device)</span></label><input id="plan-note" name="note" maxlength="180" value="${esc(plan.note)}" placeholder="Who’s coming? What’s the challenge?"></div><div class="field full"><label class="check-label"><input type="checkbox" id="plan-food" ${Object.keys(plan.food).length ? 'checked' : ''}> Include my café shortlist</label><p class="muted" style="font-size:10px;margin-top:7px">${Core.foodTotal(state.bag, CATALOG.menu).count} items currently on your list. Existing plans keep their own saved list.</p></div><div class="estimate"><span>Estimated spend<br><small>Gaming + selected food, per zone</small></span><strong id="plan-estimate"></strong></div><p class="error" id="plan-error" role="alert"></p><button class="btn field full" type="submit">${icon('check')} ${saved ? 'Update' : 'Save'} local plan</button></form>`,
    'editor',
  );
  updatePlayers(plan.players);
  updateEstimate();
}
function updatePlayers(selected = 1) {
  const zone = CATALOG.zones.find((z) => z.id === $('#plan-zone').value);
  $('#plan-players').innerHTML = Array.from(
    { length: Math.min(zone.capacity || 10, 10) },
    (_, i) =>
      `<option value="${i + 1}" ${selected === i + 1 ? 'selected' : ''}>${i + 1} ${i ? 'players' : 'player'}</option>`,
  ).join('');
}
function editorPlan() {
  const saved = state.plans.find((p) => p.id === editorId);
  return {
    zoneId: $('#plan-zone').value,
    date: $('#plan-date').value,
    time: $('#plan-time').value,
    hours: Number($('#plan-hours').value),
    players: Number($('#plan-players').value),
    note: $('#plan-note').value.trim(),
    food: $('#plan-food').checked
      ? { ...(saved && Object.keys(saved.food).length ? saved.food : state.bag) }
      : {},
  };
}
function updateEstimate() {
  const cost = Core.estimate(editorPlan(), CATALOG);
  $('#plan-estimate').textContent =
    (cost.unknown ? '~ ' : '') + money(cost.total) + (cost.unknown ? ' + quote' : '');
}
function savePlan() {
  const plan = editorPlan(),
    error = Core.validatePlan(plan, CATALOG);
  if (error) {
    $('#plan-error').textContent = error;
    return;
  }
  if (!editorId && state.plans.length >= 50) {
    $('#plan-error').textContent =
      'You have 50 saved plans. Remove an old one to make room.';
    return;
  }
  const id =
    editorId ||
    'plan-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  state.plans = state.plans.filter((p) => p.id !== id);
  state.plans.push({ ...plan, id });
  persist();
  go('plans');
  toast('Saved on this device. Your session is not booked yet.');
}
function confirmSheet(title, description, action, id = '') {
  openSheet(
    `<div class="eyebrow">Your device. Your choice.</div><h2 id="sheet-title">${esc(title)}</h2><p class="sheet-intro">${esc(description)}</p><div class="link-row" style="margin-top:25px"><button class="btn ghost" data-action="close">Keep it</button><button class="btn danger" data-confirm="${action}" data-id="${esc(id)}">${action === 'reset' ? 'Reset app data' : 'Delete plan'}</button></div>`,
    'confirm',
  );
}
function changeQty(id, delta) {
  if (!CATALOG.menu.some((f) => f.slug === id)) return;
  const n = Math.max(0, Math.min(20, (state.bag[id] || 0) + delta));
  if (n) state.bag[id] = n;
  else delete state.bag[id];
  persist();
  if (sheetKind === 'bag') showBag();
  else if (tab === 'cafe') {
    const position = $('#food-results').getBoundingClientRect().top;
    $('#food-results').innerHTML = foodResults();
    $('#food-summary').innerHTML = foodSummary();
  }
  nav();
}
function showBag() {
  const cost = Core.foodTotal(state.bag, CATALOG.menu),
    items = CATALOG.menu.filter((f) => state.bag[f.slug]);
  openSheet(
    `<div class="eyebrow">Your café shortlist</div><h2 id="sheet-title">Fuel for the crew.</h2><p class="sheet-intro">A handy list to show at the counter. It hasn’t been sent, ordered or paid for.</p><div class="food-list" style="margin-top:20px">${items.length ? items.map(foodCard).join('') : '<p class="muted">Your café list is empty. Find something good in the café tab.</p>'}</div><div class="estimate" style="margin-top:20px"><span>Priced items${cost.unknown ? '<br>+ ' + cost.unknown + ' items to confirm at counter' : ''}</span><strong>${money(cost.total)}</strong></div><button class="btn" style="width:100%;margin-top:20px" data-action="new-plan">Include in a session plan ${icon('arrow')}</button>`,
    'bag',
  );
}
function timerSheet() {
  const timer = state.timer,
    left = Core.remaining(timer),
    percentage = timer ? Math.max(0, Math.min(100, (left / timer.totalMs) * 100)) : 100;
  openSheet(
    `<div class="timer-panel"><div class="eyebrow">Make time for play</div><h2 id="sheet-title">Your session timer.</h2><p class="sheet-intro" style="margin-inline:auto">Use it for a match, a session or a well-earned screen break.</p><div class="timer-ring" style="--progress:${percentage}%"><div class="timer-inner"><div class="timer-value" data-timer>${timer ? timerValue() : '30:00'}</div><small id="timer-status">${timer ? (left === 0 ? 'Time for a break' : timer.running ? 'Session in progress' : 'Paused') : 'Ready when you are'}</small></div></div><div class="timer-controls">${timer ? `<button class="btn" data-action="toggle-timer">${icon(timer.running ? 'pause' : 'play')}${timer.running ? 'Pause' : 'Resume'}</button><button class="btn ghost" data-action="stop-timer">Reset</button>` : `<button class="btn" data-timer-minutes="30">${icon('play')} Start 30 minutes</button>`}</div><div class="timer-durations">${[30, 60, 90, 120].map((n) => `<button class="chip" data-timer-minutes="${n}">${n} min</button>`).join('')}</div><p class="end-note">The timer uses your device clock and survives closing the app. It does not send background alarms or reserve a gaming slot.</p></div>`,
    'timer',
  );
}
function shareText(plan) {
  const zone = CATALOG.zones.find((z) => z.id === plan.zoneId),
    cost = Core.estimate(plan, CATALOG);
  return `GAMEON · Our session idea\n${zone.name}\n${dayLabel(plan.date)} at ${timeLabel(plan.time)}\n${plan.hours} hour(s) · ${plan.players} player(s)\nEstimated budget: ${money(cost.total)}${cost.unknown ? ' + items to quote at the counter' : ''}\n${plan.note ? 'Crew note: ' + plan.note + '\n' : ''}${
    cost.count
      ? 'Café list:\n' +
        CATALOG.menu
          .filter((f) => plan.food[f.slug])
          .map((f) => plan.food[f.slug] + ' × ' + f.name)
          .join('\n') +
        '\n'
      : ''
  }\nLocal plan only—not a confirmed booking. Confirm availability with GameOn.`;
}
async function sharePlan(id) {
  const plan = state.plans.find((p) => p.id === id);
  if (!plan) return;
  const text = shareText(plan);
  if (navigator.userAgent.includes('GameOnOffline/')) {
    location.href = 'gameon-share://text?body=' + encodeURIComponent(text);
    return;
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: 'GameOn session plan', text });
    } catch (e) {
      if (e.name !== 'AbortError') showShareCopy(text);
    }
    return;
  }
  showShareCopy(text);
}
function showShareCopy(text) {
  openSheet(
    `<div class="eyebrow">Bring your crew</div><h2 id="sheet-title">Share your plan.</h2><p class="sheet-intro">Copy this into your group chat. It’s a plan, not a reservation.</p><textarea id="share-copy" readonly rows="10" style="margin-top:20px">${esc(text)}</textarea><button class="btn" style="width:100%;margin-top:14px" data-action="copy-plan">Copy plan text</button>`,
    'share',
  );
}
async function copyPlan() {
  const area = $('#share-copy');
  area.select();
  try {
    await navigator.clipboard.writeText(area.value);
    toast('Plan copied. Bring your crew.');
  } catch {
    toast('Select and copy the plan text to share.');
  }
}
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go) return go(button.dataset.go);
  if (button.dataset.favorite) {
    const id = button.dataset.favorite;
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((x) => x !== id)
      : [...state.favorites, id];
    persist();
    render(false);
    return;
  }
  if (button.dataset.zone) return zoneDetail(button.dataset.zone);
  if (button.dataset.filter) {
    onlyFavorites = button.dataset.filter === 'saved';
    render(false);
    return;
  }
  if (button.dataset.category) {
    category = button.dataset.category;
    render(false);
    return;
  }
  if (button.dataset.qty)
    return changeQty(button.dataset.qty, Number(button.dataset.delta));
  if (button.dataset.planZone) return newPlan(button.dataset.planZone);
  if (button.dataset.editPlan) return newPlan(null, button.dataset.editPlan);
  if (button.dataset.deletePlan)
    return confirmSheet(
      'Remove this plan?',
      'This removes the saved idea from this device. It doesn’t cancel a real booking.',
      'delete',
      button.dataset.deletePlan,
    );
  if (button.dataset.sharePlan) return sharePlan(button.dataset.sharePlan);
  if (button.dataset.startPlan) {
    const plan = state.plans.find((p) => p.id === button.dataset.startPlan);
    if (!plan) return;
    startTimer(plan.hours * 60);
    return;
  }
  if (button.dataset.themeChoice) return setTheme(button.dataset.themeChoice);
  if (button.dataset.timerMinutes) return startTimer(Number(button.dataset.timerMinutes));
  if (button.dataset.confirm) {
    if (button.dataset.confirm === 'reset') {
      state = Core.empty();
      persist();
      applyTheme();
      go('play');
      toast('This device’s app data has been reset.');
    } else {
      state.plans = state.plans.filter((p) => p.id !== button.dataset.id);
      persist();
      go('plans');
      toast('Local plan removed.');
    }
    return;
  }
  const action = button.dataset.action;
  if (action === 'new-plan') newPlan();
  else if (action === 'timer') timerSheet();
  else if (action === 'bag') showBag();
  else if (action === 'close') closeSheet();
  else if (action === 'reset')
    confirmSheet(
      'Start fresh?',
      'Remove your favourites, café list, saved plans, timer and theme preference from this device.',
      'reset',
    );
  else if (action === 'toggle-timer') {
    state.timer = Core.toggleTimer(state.timer);
    persist();
    timerSheet();
    render(false);
  } else if (action === 'stop-timer') {
    state.timer = null;
    persist();
    timerSheet();
    render(false);
  } else if (action === 'copy-plan') copyPlan();
});
function startTimer(minutes) {
  state.timer = Core.startTimer(minutes);
  persist();
  render(false);
  timerSheet();
}
document.addEventListener('input', (event) => {
  if (event.target.id === 'food-search') {
    search = event.target.value;
    $('#food-results').innerHTML = foodResults();
  }
  if (event.target.closest('#plan-form')) updateEstimate();
});
document.addEventListener('change', (event) => {
  if (event.target.id === 'plan-zone') updatePlayers();
  if (event.target.closest('#plan-form')) updateEstimate();
});
document.addEventListener('submit', (event) => {
  if (event.target.id === 'plan-form') {
    event.preventDefault();
    savePlan();
  }
});
$('#theme-button').addEventListener('click', () =>
  setTheme(currentTheme() === 'dark' ? 'light' : 'dark'),
);
$('#sheet-close').addEventListener('click', closeSheet);
sheet.addEventListener('click', (event) => {
  if (event.target === sheet) {
    const box = sheet.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      closeSheet();
  }
});
sheet.addEventListener('close', () => {
  sheetKind = '';
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
window.gameonBack = () => {
  if (sheet.open) {
    closeSheet();
    return true;
  }
  if (tab !== 'play') {
    go('play');
    return true;
  }
  return false;
};
function tick() {
  if (!state.timer) return;
  const value = timerValue();
  document.querySelectorAll('[data-timer]').forEach((el) => (el.textContent = value));
  if (sheetKind === 'timer') {
    const left = Core.remaining(state.timer);
    $('.timer-ring').style.setProperty(
      '--progress',
      Math.max(0, (left / state.timer.totalMs) * 100) + '%',
    );
    $('#timer-status').textContent =
      left === 0
        ? 'Time for a break'
        : state.timer.running
          ? 'Session in progress'
          : 'Paused';
  }
}
setInterval(tick, 1000);
document.addEventListener('visibilitychange', tick);
const initial = location.hash.slice(1);
if (['play', 'cafe', 'plans', 'visit'].includes(initial)) tab = initial;
applyTheme();
render();
