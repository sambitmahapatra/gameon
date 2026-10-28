# GameOn V3 — Final Build Handoff for Claude Code

## What's happening

You previously built the GameOn Dynamic Gaming Café website in `/home/claude/gameon` (Next.js 14 + TypeScript + Tailwind + shadcn/ui + GSAP + better-sqlite3). The **backend is working** — SQLite, API routes, booking flow logic. But the **UI was broken** in the last pass: scroll-triggered animations left sections stuck at `opacity: 0`, zone cards failed to render, images were empty gradient boxes.

I have now **designed and approved** the exact look and feel the client wants, as a single-file HTML reference. Your job is to **port that design** into the existing Next.js project, preserving every piece of working backend code, and polish it to that premium standard across every page.

The approved reference is attached as `gameon_reference_design.html` — treat it as the design source of truth. Open it in a browser first, scroll through it, understand the design language, then port it.

---

## 1. What to preserve (do not touch)

Keep every file in these paths exactly as they are, unless the design port genuinely requires a change (and then stop and explain):

- `src/lib/db.ts` — SQLite connection + query helpers
- `src/lib/seed.ts` — seed data for zones, slots, events
- `src/app/api/**/*.ts` — all API routes (zones, slots, bookings)
- `data/gameon.db` — the SQLite file
- The booking flow's business logic (slot availability math, booking creation, cancellation)
- `package.json` dependencies that are already installed (add more, don't remove)
- Database schema in `src/lib/db.ts`

If a UI change requires touching any of these, pause and ask before changing it.

---

## 2. What to replace completely

Replace every file in these paths with new implementations that match the reference design:

- `src/app/layout.tsx` — root layout, font imports, theme provider
- `src/app/globals.css` — design tokens, grain overlay, base styles
- `src/components/navbar.tsx`
- `src/components/footer.tsx`
- `src/components/hero.tsx` (if separate) or landing page sections
- `src/app/page.tsx` — the landing page
- `src/app/book/page.tsx` and `src/app/book/confirm/[id]/page.tsx`
- `src/app/events/page.tsx`
- `src/app/menu/page.tsx`
- `src/app/membership/page.tsx`
- `src/app/zones/[slug]/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/not-found.tsx`
- Any theme toggle component
- Any animation / motion utility files

Delete components that no longer fit the new design (old zone card, old pricing table, old hero, old grain / mesh placeholders).

---

## 3. The approved design

**Open `gameon_reference_design.html` in a browser before you start writing code.** Scroll through it. Toggle the theme. Hover the zone cards. Move your cursor across the hero. The design is dense with intentional detail — a text summary cannot capture it.

### 3.1 Design tokens (copy exactly)

```css
/* light values on bare :root */
:root {
  --bg:            #FAFAF5;
  --bg-elevated:   #FFFFFF;
  --surface:       #F2F0E8;
  --surface-2:     #E8E6DD;
  --fg:            #0A0E17;
  --fg-muted:      #58607A;
  --fg-dim:        #8891A8;
  --border:        #E2DFD3;
  --border-strong: #CFCCBF;
  --accent:        #0052CC;
  --accent-glow:   rgba(0,82,204,.18);
  --magenta:       #C2185B;
  --magenta-glow:  rgba(194,24,91,.14);
  --amber:         #B45309;
  --violet:        #6D28D9;
  --green:         #047857;
  --grain-opacity: .035;
  --mesh-opacity:  .55;
  --spotlight:     rgba(0,82,204,.08);
}

/* dark values (both media query and explicit) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:            #06080F;
    --bg-elevated:   #0D1120;
    --surface:       #121828;
    --surface-2:     #1A2238;
    --fg:            #ECEEF4;
    --fg-muted:      #8891A8;
    --fg-dim:        #5C6584;
    --border:        #1C2338;
    --border-strong: #2A334F;
    --accent:        #00F0FF;
    --accent-glow:   rgba(0,240,255,.22);
    --magenta:       #FF2E9A;
    --magenta-glow:  rgba(255,46,154,.18);
    --amber:         #FFB84D;
    --violet:        #A78BFA;
    --green:         #10D97E;
    --grain-opacity: .055;
    --mesh-opacity:  .75;
    --spotlight:     rgba(0,240,255,.09);
    color-scheme: dark;
  }
}
:root[data-theme="dark"] { /* same dark values repeated */ }
```

Full token definitions, exact gradient recipes, and all component CSS are in `gameon_reference_design.html` — copy from there.

### 3.2 Typography

- Display / headings: **Bricolage Grotesque** (variable, weights 400 / 500 / 700 / 800)
- Body: **Instrument Sans** (weights 400 / 500 / 600)
- Data / mono: **JetBrains Mono** (weights 400 / 500)

Load via `next/font/google` in `src/app/layout.tsx`:

```ts
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400','500','700','800'], variable: '--font-display' });
const body    = Instrument_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-body' });
const mono    = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' });
```

Expose as CSS variables and declare utility classes in `globals.css`:
`.font-display { font-family: var(--font-display), system-ui, serif; }` etc.

### 3.3 Signature treatments (the things that make it premium)

| Treatment | Where | Purpose |
|---|---|---|
| SVG grain overlay | Fixed, every page, z-index 2, mix-blend-mode overlay | #1 "premium" tell — do not skip |
| Animated mesh gradient blobs | Hero + Final CTA sections | Atmospheric depth |
| Spotlight cursor | Hero only, desktop only | Interactivity hint |
| Clip-path word reveal | Hero headline on load | Signature entrance moment |
| Zone card 3D tilt | On mouse move, desktop only | Playful depth |
| Magnetic buttons | Primary CTAs only | Micro-delight |
| Pulsing "Live now" dot | Nav | Life signal |
| Marquee ticker | Between hero and zones | Density + motion |
| Flowing gradient line | Above footer | Signature closure |
| Button shine sweep | On hover for all buttons | Universal polish |
| Theme toggle crossfade | Sun/moon icon swap | Finished feel |

**Do not add decorative animations beyond these without reason.** The design is already dense; more motion will push it past the premium line.

### 3.4 Hero copy (no "Powai" anywhere on the landing page)

```
Eyebrow:  The flagship opens this quarter
Headline: Six worlds. One roof.
Sub:      A grown-up gaming lounge. VR free-roam, a real 737 cockpit,
          motion racing rigs, tournament PCs, a console lounge and
          streaming pods — in one serious premium venue, with a café
          that actually feeds you.
CTAs:     Reserve a rig  ·  See the zones
Stats:    6 Zones · 12h Open daily · ₹350/hr Walk-ins from
```

### 3.5 Zone card SVG compositions

Every zone has a custom inline SVG in the reference. These are **not stock photos**. They are hand-composed abstract scenes in each zone's accent color:

- **VR Arena** (cyan) — concentric arcs + abstract headset silhouette
- **Flight Sim** (amber) — night-approach view with distant city lights + HUD reticle
- **Racing Cockpit** (magenta) — speed lines converging + hexagonal wheel
- **Esports Station** (violet) — monitor silhouette + RGB keyboard grid
- **Console Lounge** (green) — split-screen OLED + two controllers
- **Streaming Pod** (pink) — ring light + mic + waveform

Copy the exact SVG code from the reference HTML into a React component (`ZoneArt.tsx`) that takes a `slug` prop and returns the right SVG. Preserve `preserveAspectRatio="xMidYMid slice"` so the art fills the card.

The hero visual is a separate larger orbital composition (six colored orbs orbiting a glowing core) — also copy exactly, into a `HeroVisual.tsx` component.

### 3.6 Three signature experience features

Below the zones, a three-feature section:

1. **VR Arena** — "Walk around inside the game." (alt-left layout)
2. **Flight Simulator** — "Hand-fly a 737 into a city at dusk." (alt-right)
3. **Streaming Pod** — "Go live without buying a studio." (alt-left)

Each has a full-size SVG composition (also in the reference). Build as a `FeatureBlock` component with `imageSide: 'left' | 'right'` prop.

---

## 4. Pages and their design-port scope

### 4.1 Landing (`src/app/page.tsx`)

Port the entire reference HTML page content. Section order:
1. Nav (sticky, scrolls to blur-background state)
2. Hero
3. Marquee ticker
4. Zones grid (6 cards)
5. Signature experiences (3 features)
6. Pricing / membership (4 tiers, Silver highlighted)
7. Events (3 tournament cards)
8. Final CTA with animated mesh
9. Footer

The hero's "Reserve a rig" and "See the zones" CTAs link to `/book` and `#zones`.

### 4.2 Booking wizard (`src/app/book/page.tsx`)

**Keep the existing 4-step stepper logic (Zone → Date & Time → Details → Review) and the API calls.** Reskin only:
- Progress indicator uses the reference design's dot-and-line style with pulsing active dot
- Zone selector uses the new ZoneArt SVGs as cards
- Date picker: shadcn Calendar, restyled with design tokens
- Slot grid: 4-col mobile / 6-col desktop, available slots have cyan hover border, booked slots are muted + strikethrough, selected slot is filled cyan
- Details form: floating label pattern on focus (label floats up on input focus)
- Review step: summary card with the same visual language as pricing tiers

### 4.3 Confirmation (`src/app/book/confirm/[id]/page.tsx`)

- Server-side fetch the booking from `/api/bookings/[id]`
- Hero-style page: big headline "You're in.", booking ID in large JetBrains Mono
- QR code (server-rendered SVG using `qrcode` npm package) at 240×240
- Draw-in animation on the QR code strokes (stroke-dasharray + GSAP on mount, 1.2s)
- Zone · Date · Time · Party size · Name in a two-column meta list
- Timeline progress (Reserved → En route → Checked in) with only first dot active, cyan pulse
- "Add to Calendar" (ICS download link) and "Message us on WhatsApp" buttons
- "Cancel booking" link opens a shadcn Dialog with confirm → DELETE

### 4.4 Events (`src/app/events/page.tsx`)

Port the 3-card events layout from the reference. Add:
- Hero: "Something is on almost every night"
- Filter chips: All · Weekly · Monthly · Corporate
- Infinite scroll or "Load more" if the DB has more than 6
- Past events in a collapsed section at the bottom

### 4.5 Menu (`src/app/menu/page.tsx`)

- Hero: "Fuel between frags"
- shadcn Tabs: Snacks · Mains · Drinks · Combos
- Each tab shows items in a 2-column grid, matching the reference's typography
- Item: name (Bricolage), description (Instrument Sans muted), price (JetBrains Mono)
- Vegetarian/non-veg indicator dot (green/red small square)
- "Order at counter" footer note

### 4.6 Membership (`src/app/membership/page.tsx`)

- Hero + 4-tier comparison (expand the tiers from the landing page's section)
- Full feature comparison table (12 rows): hours/month, discount, booking window, free tournament entries, lounge access, birthday hour, loyalty multiplier, guest passes, concierge, exclusive events, priority support, member merch
- Mobile: horizontal snap-scroll of tier cards
- FAQ accordion (6 questions) at the bottom
- "Become a member" button opens a Dialog with a quick signup form (writes to a `members` table — add to schema if needed)

### 4.7 Zone detail (`src/app/zones/[slug]/page.tsx`)

- Hero image = that zone's ZoneArt SVG, full-bleed, 2:1 aspect ratio
- "The room" section: 2-paragraph description specific to the zone
- Specs sidebar: Capacity, Hourly rate, Session lengths available, What's included
- Image gallery: 4 more zone-themed SVG mini-compositions (variants)
- "Other zones" section at the bottom: horizontal scroll of the other 5 zone cards
- "Reserve this zone" CTA → `/book?zone=slug`

### 4.8 Admin (`src/app/admin/page.tsx`)

- Simple password gate (env var `ADMIN_KEY`, query-string check)
- Top row: 4 stat cards (today's bookings, this week's revenue, next 7-day occupancy, active members)
- Bookings table with design-system styling (zebra stripe, hover row highlight, cyan selected row)
- Filters: date range picker, zone select, status select
- Row actions: cancel (confirm dialog), view details (expand row)
- Export CSV button (client-side generation)
- Loading skeletons use grain + shimmer

### 4.9 404 (`src/app/not-found.tsx`)

- Themed with the orbital hero composition
- Headline: "This zone doesn't exist yet."
- Sub + link back home + search bar

---

## 5. Where you have creative latitude

The reference is the design floor, not the ceiling. **Add polish in these specific places if (and only if) it serves the user:**

### 5.1 Page transitions
Use Next.js App Router's `template.tsx` with a Framer Motion fade-and-rise between routes (200–300ms, respect reduced-motion). Keep it subtle; the grain overlay must persist across transitions.

### 5.2 Form input polish
Floating labels on booking form inputs. Live validation feedback with cyan check / amber warning icons. Error messages fade in rather than snap in.

### 5.3 Loading states
Branded skeletons: instead of grey rectangles, use subtle animated gradient placeholders in the design's accent colors.

### 5.4 Empty states
A tiny abstract SVG mark + a one-line "Nothing yet" message in Instrument Sans muted. Match the design's visual language.

### 5.5 Micro-interactions
- Nav links: cyan underline grows left-to-right on hover (already in reference)
- Pricing tier cards: on hover, a very subtle lift + border color shift (already in reference)
- Event cards: progress bar animates on initial view (fill from 0 to final %)
- Admin table rows: a thin left-edge cyan accent appears on hover

### 5.6 Hero enhancements (if performance allows)
- Parallax on the orbital composition (translate -5% to 5% based on mouse position)
- A single ambient particle drift behind the hero (very low opacity, slow motion)
- The core orb's pulse rate briefly syncs with cursor proximity

### 5.7 Confirmation page delight
- QR code draws itself in on page load (stroke-dasharray + GSAP)
- Confetti burst in brand colors on initial render (one-time, subtle, respect reduced-motion)

### 5.8 Admin polish
- A tiny sparkline next to each stat card showing the 7-day trend
- Keyboard shortcut: `/` focuses the search / filter row

### 5.9 Accessibility bonuses
- Skip-to-content link that appears on tab focus
- All animations include a reduced-motion fallback
- Focus rings use the cyan accent (already in reference)

### 5.10 One Easter egg (optional)
- Konami code triggers a quick "GG" micro-animation in the nav

---

## 6. Hard guardrails (do not break any of these)

These are the rules that failed in the last pass:

1. **Never leave a visible element at `opacity: 0` waiting for an IntersectionObserver.** Use `gsap.from()` with `immediateRender: false` and `start: 'top bottom'`, or set the resting state to visible and have the animation enhance from there. If a scroll trigger fails to fire, the element must still be visible.

2. **Never apply a scroll animation to a parent element whose children render independently.** Test by scrolling with JavaScript disabled — if any content disappears, you've got a bug.

3. **The grain overlay sits at `z-index: 2` with `pointer-events: none`.** All interactive content must have `z-index: 3` or higher, or sit inside a stacking context above the grain. If the grain hides content, you've z-indexed wrong.

4. **Spotlight cursor and mesh gradient use `position: absolute` and `pointer-events: none`** — they must never block clicks or hover on content above them.

5. **Test every page in BOTH themes before marking a phase done.** Light mode is not an afterthought.

6. **Test every page at 375px width.** No horizontal scroll on the body. Any zone card, pricing table, or events grid that doesn't stack cleanly is a bug.

7. **Respect `prefers-reduced-motion`.** Disable: mesh gradient drift, spotlight cursor, card tilt, magnetic buttons, QR draw-in, confetti, parallax. Keep: hover color changes, static layouts.

8. **Never introduce an animation without a performance ceiling.** All continuous animations (grain, mesh drift, orbital spin) use CSS transforms + opacity only. GSAP timelines are killed on route change.

9. **Preserve the booking flow end-to-end.** After each page port, test: click "Reserve a rig" → pick zone → pick date/time → fill details → confirm → see confirmation with QR code → cancel → verify DB updated. If this breaks at any point, stop and fix before moving on.

10. **Font loading must not block render.** Use `next/font/google` with `display: 'swap'`. If any heading flashes with an unstyled fallback for more than a frame, pre-connect to Google Fonts in the layout head.

---

## 7. Execution plan (do in this order, test between each)

### Phase 1 — Design system foundation _(~30 min)_
1. Install any missing deps: `npm install framer-motion` (for page transitions)
2. Update `src/app/globals.css` with the full token system from section 3.1
3. Update `src/app/layout.tsx` with the three fonts via `next/font/google`
4. Add the grain overlay as a fixed `<div>` in the layout
5. Add a theme toggle component (`src/components/theme-toggle.tsx`) using `next-themes`
6. **Verify:** `npm run dev` boots, toggling theme works on an empty page

### Phase 2 — Shared chrome _(~30 min)_
1. Build `src/components/navbar.tsx` matching the reference (logo, links, live pill, theme toggle, CTA)
2. Build `src/components/footer.tsx` matching the reference (4-column grid, flowing gradient line)
3. Add live counter logic (fetches a `/api/live-count` endpoint — build this endpoint, return a random number between 8 and 42 for the demo)
4. **Verify:** navbar scroll-blur works, mobile drawer opens, theme toggle persists

### Phase 3 — Landing page _(~90 min)_
1. Build `HeroVisual.tsx` (orbital SVG)
2. Build `HeroSection.tsx` (headline, sub, CTAs, stats, spotlight cursor, word reveal)
3. Build `MarqueeTicker.tsx`
4. Build `ZoneArt.tsx` (switches SVG by zone slug) + `ZoneCard.tsx` (uses ZoneArt + 3D tilt)
5. Build `ZonesGrid.tsx` fetching from `/api/zones`
6. Build `FeatureBlock.tsx` + the 3 signature experience blocks
7. Build `PricingTiers.tsx` (4-tier grid, Silver highlight)
8. Build `EventsTeaser.tsx` fetching 3 upcoming from `/api/events`
9. Build `FinalCTA.tsx` with animated mesh
10. **Verify:** landing page scrolls smoothly, every section renders in both themes, no console errors, mobile works

### Phase 4 — Booking flow _(~90 min)_
1. Reskin the 4-step booking wizard
2. Pre-select zone from `?zone=slug` query param
3. Confirmation page with QR, timeline, cancel dialog
4. **Verify:** complete a booking end-to-end, check DB has the record, cancel it, verify DB updated

### Phase 5 — Secondary pages _(~60 min)_
1. Events page (full)
2. Menu page (full)
3. Membership page (full with comparison table + FAQ)
4. Zone detail pages (`/zones/[slug]`)
5. **Verify:** every navbar link lands on a populated page in both themes

### Phase 6 — Admin + polish _(~45 min)_
1. Admin dashboard with stats, table, filters, actions
2. 404 page
3. Loading states and empty states across the app
4. Add the creative latitude items from section 5 that you want to include
5. **Verify:** admin password gate works, cancellation reflects in DB

### Phase 7 — Final pass _(~30 min)_
1. Mobile check at 375px on every page
2. Reduced-motion check (set in DevTools)
3. Keyboard-only navigation on booking flow
4. Lighthouse audit: Performance ≥ 80, Accessibility ≥ 95
5. `npm run build` with no type errors

---

## 8. Testing checklist (gate for "done")

Before you say the project is complete, verify every item:

- [ ] `npm run dev` starts without errors or warnings
- [ ] `npm run build` succeeds, no TypeScript errors
- [ ] Theme toggle: works, persists, smooth icon swap
- [ ] Landing page: hero animates once on load, no section stuck invisible
- [ ] All 6 zone cards render with their SVG art in both themes
- [ ] 3D tilt on zone cards works on desktop, disabled on touch
- [ ] Marquee ticker scrolls smoothly, pauses on hover (optional)
- [ ] Signature features: 3 feature blocks with correct SVGs, alternating layout
- [ ] Pricing: Silver tier highlighted with "Most picked" badge
- [ ] Events: 3 cards with correct fill-progress and dates
- [ ] Final CTA mesh animates slowly in both themes
- [ ] Footer: flowing gradient line animates
- [ ] Navbar: blurs background on scroll, mobile Sheet drawer opens
- [ ] "Live now" dot has pulsing ring animation
- [ ] Booking flow: zone pre-select from query param works
- [ ] Booking flow: completes end-to-end, booking ID generated, saved to DB
- [ ] Confirmation page: QR renders, timeline shows, cancel works
- [ ] Admin page: password gate, table loads, cancel reflects in DB
- [ ] 404 page: themed, not default Next.js 404
- [ ] Every page works at 375px (no horizontal scroll)
- [ ] Every page works in both light and dark theme
- [ ] `prefers-reduced-motion` disables mesh drift, tilt, magnetic, parallax
- [ ] Keyboard navigation: tab through nav, focus visible, booking flow completable
- [ ] Lighthouse: Performance ≥ 80, Accessibility ≥ 95
- [ ] No `console.error` or `console.warn` output in dev

---

## 9. What to show after each phase

After completing each phase, take a screenshot of the key page in both themes and show it. Call out:
- What you built in this phase
- Any design decisions you had to make that weren't explicit in the reference
- Any guardrail you had to work around (and how)
- Any remaining issues before moving to the next phase

---

## 10. If something goes wrong

If a page port breaks the booking flow, **stop immediately**, revert the broken file with `git checkout`, and ask before trying again.

If the design doesn't look right in one theme but does in the other, you probably defined a color inside `[data-theme]` or `@media` without first declaring it on bare `:root`. Check for this specifically.

If a scroll-triggered animation leaves content invisible, you violated guardrail #1. Set `immediateRender: false` and `start: 'top bottom'` on the ScrollTrigger, or remove the animation.

If an SVG from the reference looks different in the Next.js build than in the reference HTML, you may have broken an SVG namespace or ID (SVG IDs must be unique per page — if the same gradient ID appears in two components, the second shadows the first).

---

## 11. Start here

1. Open `gameon_reference_design.html` in a browser. Scroll. Toggle theme. Hover. Understand.
2. Read this whole document.
3. Create a TodoWrite task list with the 7 phases.
4. Start Phase 1.

Do not skip Phase 1. The design system foundation is what prevents the breakage we saw in V2.

Good luck. You have everything you need.
