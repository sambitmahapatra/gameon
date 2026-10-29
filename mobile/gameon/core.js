const Core = (() => {
  const empty = () => ({
    version: 1,
    theme: 'system',
    favorites: [],
    bag: {},
    plans: [],
    timer: null,
  });
  function normalize(raw, catalog) {
    const next = empty(),
      source = raw && typeof raw === 'object' ? raw : {};
    if (['system', 'dark', 'light'].includes(source.theme)) next.theme = source.theme;
    const zoneIds = new Set(catalog.zones.map((z) => z.id)),
      foodIds = new Set(catalog.menu.map((f) => f.slug));
    next.favorites = Array.isArray(source.favorites)
      ? [...new Set(source.favorites.filter((id) => zoneIds.has(id)))]
      : [];
    next.bag = cleanBag(source.bag, foodIds);
    if (Array.isArray(source.plans))
      next.plans = source.plans
        .filter(
          (p) =>
            p &&
            typeof p.id === 'string' &&
            zoneIds.has(p.zoneId) &&
            /^\d{4}-\d{2}-\d{2}$/.test(p.date) &&
            /^\d{2}:\d{2}$/.test(p.time) &&
            [0.5, 1, 1.5, 2, 3].includes(p.hours) &&
            Number.isInteger(p.players) &&
            p.players >= 1 &&
            p.players <= 10,
        )
        .slice(0, 50)
        .map((p) => ({
          id: p.id.slice(0, 80),
          zoneId: p.zoneId,
          date: p.date,
          time: p.time,
          hours: p.hours,
          players: p.players,
          note: typeof p.note === 'string' ? p.note.slice(0, 180) : '',
          food: cleanBag(p.food, foodIds),
        }));
    const t = source.timer;
    if (
      t &&
      Number.isFinite(t.totalMs) &&
      t.totalMs >= 60000 &&
      t.totalMs <= 14400000 &&
      typeof t.running === 'boolean' &&
      Number.isFinite(t.endAt) &&
      Number.isFinite(t.remainingMs)
    )
      next.timer = {
        totalMs: t.totalMs,
        endAt: t.endAt,
        remainingMs: Math.max(0, Math.min(t.totalMs, t.remainingMs)),
        running: t.running,
      };
    return next;
  }
  function cleanBag(bag, ids) {
    const result = {};
    if (!bag || typeof bag !== 'object') return result;
    for (const [id, quantity] of Object.entries(bag))
      if (ids.has(id) && Number.isInteger(quantity) && quantity > 0)
        result[id] = Math.min(20, quantity);
    return result;
  }
  function foodTotal(bag, menu) {
    let total = 0,
      unknown = 0,
      count = 0;
    for (const item of menu) {
      const quantity = bag[item.slug] || 0;
      count += quantity;
      if (item.price === null) unknown += quantity;
      else total += quantity * item.price;
    }
    return { total, unknown, count };
  }
  function estimate(plan, catalog) {
    const zone = catalog.zones.find((z) => z.id === plan.zoneId);
    const food = foodTotal(plan.food || {}, catalog.menu);
    return {
      ...food,
      gaming: zone?.price === null ? null : (zone?.price || 0) * plan.hours,
      total: food.total + (zone?.price || 0) * plan.hours,
      unknown: food.unknown + (zone?.price === null ? 1 : 0),
    };
  }
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function validatePlan(plan, catalog, now = new Date()) {
    const zone = catalog.zones.find((z) => z.id === plan.zoneId);
    if (!zone) return 'Choose an experience.';
    const day = new Date(`${plan.date}T12:00:00`);
    if (
      !Number.isFinite(day.getTime()) ||
      dateKey(day) !== plan.date ||
      plan.date < dateKey(now)
    )
      return 'Choose today or a future date.';
    if (!/^\d{2}:\d{2}$/.test(plan.time)) return 'Choose a preferred start time.';
    const [hour, minute] = plan.time.split(':').map(Number),
      start = hour * 60 + minute;
    if (!Number.isFinite(start) || minute > 59 || start < 600 || start >= 1320)
      return 'Plan a start between 10 AM and 10 PM.';
    if (![0.5, 1, 1.5, 2, 3].includes(plan.hours)) return 'Choose a session duration.';
    if (start + plan.hours * 60 > 1320)
      return 'Your session needs to finish by 10 PM. Try an earlier start or a shorter session.';
    if (plan.date === dateKey(now) && start <= now.getHours() * 60 + now.getMinutes())
      return 'Choose a future start time.';
    if (
      !Number.isInteger(plan.players) ||
      plan.players < 1 ||
      plan.players > Math.min(zone.capacity || 10, 10)
    )
      return 'Choose a crew size within this zone’s capacity.';
    return '';
  }
  function remaining(timer, now = Date.now()) {
    if (!timer) return 0;
    return Math.max(0, timer.running ? timer.endAt - now : timer.remainingMs);
  }
  function startTimer(minutes, now = Date.now()) {
    const totalMs = Math.min(240, Math.max(1, Math.round(minutes))) * 60000;
    return { totalMs, remainingMs: totalMs, endAt: now + totalMs, running: true };
  }
  function toggleTimer(timer, now = Date.now()) {
    const left = remaining(timer, now);
    return timer.running
      ? { ...timer, running: false, remainingMs: left }
      : {
          ...timer,
          running: true,
          endAt: now + (left || timer.totalMs),
          remainingMs: left || timer.totalMs,
        };
  }
  return {
    empty,
    normalize,
    cleanBag,
    foodTotal,
    estimate,
    dateKey,
    validatePlan,
    remaining,
    startTimer,
    toggleTimer,
  };
})();
