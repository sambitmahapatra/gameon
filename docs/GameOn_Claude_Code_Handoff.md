# GameOn — Dynamic Gaming Café
## Website + Android App Build Handoff for Claude Code

**Project owner:** Sambit Mahapatra (B2025042, GIM PGDM Big Data Analytics, Group A-5)
**Business idea:** GameOn — a premium Dynamic Gaming Café, pilot location Powai, Mumbai
**Deliverable:** A premium, dynamic, animation-rich website that doubles as the source for an Android APK with minimal code changes
**Model:** Claude Opus 4.7 (claude-opus-4-7)
**Session:** https://claude.ai/code/session_01PAWzieE6gC3vKn8rDQh6vn

---

## 1. Executive Summary

Build a production-quality marketing + booking website for GameOn with a working demo backend. The site must look premium (think Awwwards-tier dark gaming aesthetic), animate smoothly (GSAP), and ship as a Next.js static export so Capacitor can wrap it into a signed Android APK with zero rewrites.

The build has **five phases**: scaffold + backend, core pages, secondary pages, admin + polish, and APK prep. Phases 1–4 produce a working website. Phase 5 produces the APK.

---

## 2. Project Context

### Business concept (one paragraph)
GameOn is a Dynamic Gaming Café targeting 18–45-year-olds in Powai, Mumbai — college students (IIT Bombay, NMIMS), tech professionals in Hiranandani Business Park, and casual gamers around R-City Mall. Unlike existing Mumbai competitors (Next Level Gaming, Virtual Adda, AIM, VoidZone, Parabolica, Zero Latency), GameOn differentiates on **zone diversity under one roof** — VR Arena, Flight Simulator, Racing Cockpits, Esports Stations, Console Lounge, Streaming Pods — plus a themed café and a membership tier system.

### Market data points (use selectively in copy)
- India has 500M+ gamers, median age under 29
- Indian gaming market projected USD 7–9B by 2028
- Esports officially recognized in India since 2022
- GameOn pilot: Powai; chain ambition across tier-1 metros

### Audience & tone
Aspirational-but-accessible. Not esports-gritty. Think premium lounge that happens to have world-class gaming rigs. Copy is confident, specific, user-centric. No cringey gamer slang.

---

## 3. Design Direction (locked)

### 3.1 Color palette

| Token | Hex | Use |
|---|---|---|
| `--bg-deep` | `#0A0E17` | Page background (near-black with cold blue cast — NOT pure black) |
| `--bg-surface` | `#141B2D` | Cards, panels, nav bar |
| `--bg-elevated` | `#1C2541` | Hover states, active panels, dialogs |
| `--accent-primary` | `#00E5FF` | Electric cyan — CTAs, active states, the signature "neon" |
| `--accent-warm` | `#FF6B35` | Warm orange — secondary actions, badges, alerts |
| `--text-primary` | `#E8ECF1` | Off-white body text (NOT pure white) |
| `--text-muted` | `#8B95A7` | Secondary labels, timestamps, placeholders |
| `--border-subtle` | `#1F2A44` | Dividers, card borders |

### 3.2 Typography

- **Display / headings:** `Space Grotesk` (Google Fonts, weights 500 & 700) — geometric, techy, distinctive
- **Body:** `Inter` (weights 400 & 500) — clean, excellent screen readability
- **Monospace accents:** `JetBrains Mono` (weight 500) — booking IDs, prices, numeric data

Type scale (Elements of Typographic Style default):
- Hero display: 72px / 1.05 / tracking -0.03em
- H1: 48px / 1.1 / tracking -0.02em
- H2: 32px / 1.2
- H3: 24px / 1.3
- Body: 16px / 1.6
- Small / meta: 14px / 1.5
- Monospace: 15px / 1.4

**Hard rules:**
- No ALL CAPS labels
- No single-word color accents in headlines
- No numbered markers (01 / 02 / 03) unless truly a sequence
- No em dash in labels like "WORD — fragment"
- No `→` appended to CTAs
- Line length < 80 chars

### 3.3 Layout principles

- Left-aligned content, generous whitespace (gutters: 24px mobile, 48px tablet, 96px desktop)
- Full-bleed hero with ONE orchestrated GSAP entrance — not scattered fade-ups
- Zone cards: horizontal snap-scroll on mobile, 3-column grid on desktop
- Booking wizard: single-page stepper, not multi-route
- Motion only on first paint + user interactions (click, hover, focus, open) — respect `prefers-reduced-motion`
- Border radius: 12px for cards, 8px for buttons, 24px for modals — not uniform

### 3.4 Signature treatments (what makes this GameOn, not a template)

1. **Zone cards tilt on mouse move** (3D CSS transform, max 8°) — stops at `prefers-reduced-motion`
2. **Hero: logo mark assembles from scattered particles** then tagline types in on first scroll
3. **Live-session counter** in nav bar: "47 players in-house right now" ticks up/down
4. **Booking slot grid pulses in cyan** when a slot becomes selectable
5. **Monospace booking IDs** displayed like `GON-2026-0147` — treat as design feature
6. **Scroll-driven progress bar** on booking confirmation page (dot moves along a timeline: Reserved → En route → Checked in)

---

## 4. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | React, routing, static export for APK |
| Styling | Tailwind CSS v3 | Utility-first, aligns with shadcn/ui |
| Components | shadcn/ui (New York style, dark mode) | Owned source, accessible, Radix-based |
| Animation | GSAP + @gsap/react + ScrollTrigger | Industry standard, works in WebView |
| Icons | Lucide React (shadcn default) | 1000+ icons, consistent, free |
| Database | better-sqlite3 | Zero config, file-based, demo-perfect |
| ID generation | uuid v4 | Booking IDs |
| QR codes | qrcode (npm) | Server-rendered SVG QRs on confirmation |
| Date/time | date-fns | Tree-shakeable, formats slot times |
| Forms | react-hook-form + zod | Type-safe validation |
| Toast | sonner (via shadcn) | Booking confirmation feedback |
| APK wrap | Capacitor 6 (phase 5) | Next static export → Android WebView |

### 4.1 Session skills Claude Code should use

- `frontend-design` — before writing ANY UI code (palette/type review)
- `21st:21st-ui` — for component inspiration (hero, pricing, navbar patterns)
- `image-generation` — to draft prompts for zone images (user generates externally)

### 4.2 Session skills NOT needed

- `docx`, `pdf`, `pptx`, `xlsx` — this is a web build

---

## 5. Work Breakdown Structure (WBS)

### Phase 1 — Scaffold + Backend  _(~45 min)_

**1.1 Project initialization**
- [ ] `npx create-next-app@latest gameon --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm`
- [ ] Set working dir to `/home/claude/gameon`

**1.2 Install dependencies**
- [ ] Runtime: `gsap @gsap/react better-sqlite3 uuid qrcode date-fns react-hook-form zod @hookform/resolvers sonner lucide-react class-variance-authority clsx tailwind-merge`
- [ ] Dev: `@types/better-sqlite3 @types/uuid @types/qrcode`

**1.3 Initialize shadcn/ui**
- [ ] `npx shadcn@latest init` — select New York, Zinc base, CSS variables, dark mode
- [ ] Add components: `button card dialog sheet input select tabs table badge toast skeleton progress calendar form label separator`

**1.4 Configure Tailwind & tokens**
- [ ] Extend theme with GameOn color tokens (section 3.1)
- [ ] Add font imports in `src/app/layout.tsx` via `next/font/google` for Space Grotesk, Inter, JetBrains Mono
- [ ] Register custom font families in `tailwind.config.ts`
- [ ] Add dark-mode CSS variables in `src/app/globals.css`

**1.5 Database layer (`src/lib/db.ts`)**
- [ ] Create SQLite connection (file path: `./data/gameon.db`, auto-create directory)
- [ ] Define schema (zones, slots, bookings — see section 6)
- [ ] Export typed query helpers: `getZones()`, `getAvailableSlots(zoneId, date)`, `createBooking(input)`, `getBooking(id)`, `listBookings(filter)`, `cancelBooking(id)`
- [ ] Use prepared statements with `.pragma('journal_mode = WAL')`

**1.6 Seed data (`src/lib/seed.ts`)**
- [ ] 6 zones with prices (section 6.2)
- [ ] Generate 30 days of slots per zone from today, hourly 10:00–22:00
- [ ] Script runs idempotently (check before insert)
- [ ] Export `ensureSeeded()` called once on server start

**1.7 API routes**
- [ ] `GET /api/zones` → list all zones
- [ ] `GET /api/slots?zoneId=X&date=YYYY-MM-DD` → available slots for that day
- [ ] `POST /api/bookings` → create (body validated with zod)
- [ ] `GET /api/bookings` → list (admin, no auth for demo but add a `?key=` guard)
- [ ] `GET /api/bookings/[id]` → single
- [ ] `DELETE /api/bookings/[id]` → cancel (sets status=cancelled, frees slot)

**1.8 Test backend**
- [ ] Curl each endpoint, confirm JSON shapes
- [ ] Verify slot availability updates correctly after booking

**Phase 1 exit criteria:** `npm run dev` starts, all API routes return valid JSON, database file created with seed data.

---

### Phase 2 — Core Pages  _(~90 min)_

**2.1 Root layout (`src/app/layout.tsx`)**
- [ ] Dark theme by default (no toggle for v1)
- [ ] Font variables injected
- [ ] `<Navbar />` and `<Footer />` wrapping `{children}`
- [ ] Toaster (sonner) mounted at root
- [ ] Metadata: title "GameOn — Powai's Premier Gaming Café", OG tags, favicon

**2.2 Navbar (`src/components/navbar.tsx`)**
- [ ] Logo (SVG wordmark — see section 7)
- [ ] Links: Zones · Book · Events · Menu · Membership
- [ ] "Live now: {n} players" ticker (fetches `/api/live-count` every 10s, animated)
- [ ] "Book a Session" CTA button (cyan accent)
- [ ] Mobile: shadcn Sheet drawer with the same links
- [ ] Sticky at top, blurs background on scroll (backdrop-blur-xl)

**2.3 Footer (`src/components/footer.tsx`)**
- [ ] 4-column layout: Explore / Visit / Legal / Social
- [ ] Address: "Hiranandani Gardens, Powai, Mumbai 400076"
- [ ] WhatsApp link, Instagram handle, YouTube
- [ ] Copyright + "Made in Mumbai"

**2.4 Landing page (`src/app/page.tsx`)**

Sections top-to-bottom:
- [ ] **Hero** — full viewport, headline + sub + two CTAs ("Book a Session", "See Zones"), GSAP particle-to-logo entrance
- [ ] **Live stats strip** — 4 counters (open now · zones available · tournaments this month · active members)
- [ ] **Experience Zones** — section heading + 6 zone cards with hover tilt, each links to `/book?zone=xxx`
- [ ] **Signature Experiences** — 3 feature callouts with alternating image/text layout: VR Arena, Flight Sim, Streaming Pods
- [ ] **Pricing & Membership** — pricing table (4 tiers: Walk-in, Bronze, Silver, Gold) with "Most popular" highlight on Silver
- [ ] **Tournaments teaser** — upcoming tournament card + "See all events" link
- [ ] **Final CTA** — full-bleed section with reservation prompt
- [ ] GSAP ScrollTrigger: fade-and-rise on section entry, zone card stagger

**2.5 Booking wizard (`src/app/book/page.tsx`)**

Single page, 4-step stepper (shadcn progress bar at top):
- [ ] **Step 1 — Choose Zone:** 6 zone cards, pre-select if `?zone=` present
- [ ] **Step 2 — Pick Date & Time:** calendar on left, slot grid on right; disabled slots greyed out
- [ ] **Step 3 — Your Details:** name, phone (+91 prefix fixed), party size (slider 1–10), optional email
- [ ] **Step 4 — Review & Confirm:** summary + "Confirm Booking" button → POST → redirect to `/book/confirm/[id]`
- [ ] Each step validates before advancing
- [ ] Back button on steps 2–4
- [ ] Loading skeleton on slot fetch

**2.6 Confirmation page (`src/app/book/confirm/[id]/page.tsx`)**
- [ ] Fetches booking server-side
- [ ] Displays booking ID in monospace, large
- [ ] QR code (SVG, 240×240) encoding the booking ID
- [ ] Zone · Date · Time · Party size · Name
- [ ] "Add to Calendar" (ICS download) and "WhatsApp us" buttons
- [ ] Timeline progress indicator (Reserved → En route → Checked in — only first dot active)
- [ ] "What to bring" bullet list
- [ ] "Cancel booking" link (confirm dialog → DELETE)

**Phase 2 exit criteria:** User can complete a booking end-to-end from landing page, see the confirmation page with QR code.

---

### Phase 3 — Secondary Pages  _(~60 min)_

**3.1 Events page (`src/app/events/page.tsx`)**
- [ ] Hero: "Tournaments & Events in Powai"
- [ ] 3-column grid of event cards (seeded in DB or static)
- [ ] Each card: date badge, title, game, prize pool, slots-left bar, "Register" button
- [ ] Filter chips: All · Weekly · Monthly · Corporate
- [ ] Past events in a collapsed section at the bottom

**3.2 Menu page (`src/app/menu/page.tsx`)**
- [ ] Hero: "Fuel between frags"
- [ ] shadcn Tabs: Snacks · Mains · Drinks · Combos
- [ ] Each tab shows a grid of items with name, description, price (monospace), vegetarian/non-veg dot
- [ ] 6–10 items per category (invent plausible themed items: "Headshot Nachos", "Victory Burger", "Health Potion Mocktail")
- [ ] No cart — "Order at counter" footer note

**3.3 Membership page (`src/app/membership/page.tsx`)**
- [ ] Hero: "Members play more"
- [ ] 4-tier comparison table (Walk-in · Bronze · Silver · Gold) with 10 feature rows (hours/month, discount, priority booking, free tournament entries, lounge access, birthday hour, loyalty points multiplier, guest passes, concierge, exclusive events)
- [ ] Mobile: horizontal snap-scroll of tier cards instead of table
- [ ] FAQ accordion at bottom (6 questions)
- [ ] CTA: "Become a member" → opens a Dialog with name/phone/tier selector (writes to a `members` table — add to schema)

**3.4 Zone detail pages (`src/app/zones/[slug]/page.tsx`)**
- [ ] Dynamic route for each of the 6 zones
- [ ] Hero image + description
- [ ] Specs panel: capacity, duration options, games/content available, price per hour
- [ ] 4–6 image gallery
- [ ] "Reserve this zone" CTA → `/book?zone=slug`

**Phase 3 exit criteria:** All navigation links in navbar lead to populated pages.

---

### Phase 4 — Admin + Polish  _(~45 min)_

**4.1 Admin dashboard (`src/app/admin/page.tsx`)**
- [ ] Simple password gate (env var `ADMIN_KEY`, query-string check — not production auth, just demo)
- [ ] Top stats: today's bookings, this week's revenue, next 7 days' occupancy
- [ ] Bookings table with columns: ID, Zone, Date, Time, Name, Phone, Party, Status, Actions
- [ ] Filters: date range picker, zone select, status select
- [ ] Row action: cancel (confirmation dialog)
- [ ] Export CSV button (client-side CSV generation)

**4.2 404 page (`src/app/not-found.tsx`)**
- [ ] Themed: "This zone doesn't exist yet"
- [ ] Link back home + search bar (optional)

**4.3 Loading & error states**
- [ ] Every page gets a `loading.tsx` with themed skeletons
- [ ] Every API fetch has an error boundary with retry

**4.4 Responsive pass**
- [ ] Test every page at 375px (iPhone SE), 768px (iPad), 1440px (desktop)
- [ ] Fix any horizontal scroll, text overflow, broken grids

**4.5 Accessibility pass**
- [ ] All interactive elements have visible focus rings (cyan outline)
- [ ] Color contrast ≥ 4.5:1 for body text (verify cyan on dark bg)
- [ ] `prefers-reduced-motion` respected — GSAP timelines check this
- [ ] All images have alt text
- [ ] Keyboard navigation works end-to-end for booking flow

**4.6 Performance pass**
- [ ] Images: use `next/image` with proper sizes
- [ ] GSAP: register plugins only once, kill timelines on unmount
- [ ] Lighthouse score target: Performance ≥ 85, Accessibility ≥ 95

**Phase 4 exit criteria:** Full site works on mobile and desktop, no console errors, accessible, no obvious bugs.

---

### Phase 5 — APK Preparation  _(~30 min, optional for v1)_

**5.1 Configure static export**
- [ ] `next.config.js`: add `output: 'export'`, `images: { unoptimized: true }`
- [ ] Note: API routes won't work in a static export — for APK, point the client to a hosted backend (Vercel or Render for the Next.js app without export, or a separate Express server)
- [ ] Alternative: keep API routes, deploy website to Vercel, and the APK WebView points to the deployed URL via `server.url` in Capacitor config

**5.2 Install Capacitor**
- [ ] `npm install @capacitor/core @capacitor/cli @capacitor/android`
- [ ] `npx cap init GameOn com.gameon.app --web-dir=out`

**5.3 Build + add Android platform**
- [ ] `npm run build && next export`
- [ ] `npx cap add android`
- [ ] `npx cap sync`

**5.4 Capacitor config (`capacitor.config.ts`)**
- [ ] `webDir: 'out'`
- [ ] `server.androidScheme: 'https'`
- [ ] If using hosted backend: `server.url: 'https://gameon.vercel.app'`
- [ ] Status bar: dark theme, cyan accent

**5.5 Install Capacitor plugins (minimal)**
- [ ] `@capacitor/push-notifications` — for tournament alerts
- [ ] `@capacitor/haptics` — tactile feedback on booking confirm
- [ ] `@capacitor/status-bar` — themed status bar

**5.6 Build the APK**
- [ ] `npx cap open android` → opens Android Studio
- [ ] Build → Generate Signed Bundle / APK → APK → create keystore → build release APK

**Phase 5 exit criteria:** Installable APK file that opens GameOn on an Android device.

---

## 6. Database Schema

### 6.1 Tables

```sql
CREATE TABLE IF NOT EXISTS zones (
  id            TEXT PRIMARY KEY,       -- 'vr-arena', 'flight-sim', ...
  name          TEXT NOT NULL,
  tagline       TEXT NOT NULL,
  description   TEXT NOT NULL,
  price_per_hour INTEGER NOT NULL,      -- in INR
  capacity      INTEGER NOT NULL,
  image         TEXT,                   -- /images/zones/vr-arena.jpg
  accent_hex    TEXT                    -- per-zone signature color
);

CREATE TABLE IF NOT EXISTS slots (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id   TEXT NOT NULL REFERENCES zones(id),
  date      TEXT NOT NULL,              -- 'YYYY-MM-DD'
  time      TEXT NOT NULL,              -- 'HH:MM'
  booked    INTEGER NOT NULL DEFAULT 0, -- 0 or 1
  UNIQUE(zone_id, date, time)
);

CREATE TABLE IF NOT EXISTS bookings (
  id          TEXT PRIMARY KEY,         -- 'GON-2026-XXXX' (short UUID)
  zone_id     TEXT NOT NULL REFERENCES zones(id),
  slot_id     INTEGER NOT NULL REFERENCES slots(id),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  party_size  INTEGER NOT NULL DEFAULT 1,
  status      TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'cancelled'
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL UNIQUE,
  tier       TEXT NOT NULL,             -- 'bronze' | 'silver' | 'gold'
  joined_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  game        TEXT NOT NULL,
  date        TEXT NOT NULL,
  prize_pool  INTEGER NOT NULL,
  slots       INTEGER NOT NULL,
  registered  INTEGER NOT NULL DEFAULT 0,
  category    TEXT NOT NULL             -- 'weekly' | 'monthly' | 'corporate'
);
```

### 6.2 Zone seed data

| ID | Name | Tagline | Price/hr (₹) | Capacity | Accent |
|---|---|---|---|---|---|
| `vr-arena` | VR Arena | Step into other worlds | 800 | 6 | `#00E5FF` |
| `flight-sim` | Flight Simulator | Fly a Boeing 737. Really. | 1200 | 2 | `#FF6B35` |
| `racing-cockpit` | Racing Cockpit | Full-motion rig, F1 pedals | 600 | 4 | `#FFC857` |
| `esports-station` | Esports Station | RTX 4080, 240Hz, your game | 400 | 10 | `#7B61FF` |
| `console-lounge` | Console Lounge | PS5 · Xbox Series X · Switch | 350 | 8 | `#00D97E` |
| `streaming-pod` | Streaming Pod | Broadcast-ready setup | 500 | 2 | `#FF4D8F` |

### 6.3 Event seed data (invent 6 events)

Weekly: Valorant Thursdays, FIFA Fridays. Monthly: BGMI Showdown (₹50k prize), FC25 Powai Cup. Corporate: company team-building packages. Add realistic future dates.

---

## 7. Component Specifications (key pieces)

### 7.1 Hero (`src/components/hero.tsx`)

```
Visual: Full viewport, bg-deep. A particle field (CSS or canvas) in the
background drifts slowly. On mount, GSAP timeline:
  1. 0.0s — "GameOn" wordmark assembles from scattered dots (0.8s)
  2. 0.8s — Tagline types in: "Powai's premier gaming café" (0.6s)
  3. 1.4s — Sub-line fades in: "Six worlds. One roof. Zero compromises."
  4. 1.7s — Two CTAs rise in (stagger 0.1s)
Headline typography: Space Grotesk 72px, weight 700, tracking -0.03em
CTAs: "Book a Session" (cyan, filled) · "See Zones" (ghost, cyan border)
Below the fold: scroll chevron with gentle up-down loop
```

### 7.2 Zone Card (`src/components/zone-card.tsx`)

```
140px tall × full column width. bg-surface, border-subtle, radius 12px.
Layout: image left (40%), content right (60%).
Content: name (Space Grotesk 24px), tagline (Inter 14px muted),
         price row (JetBrains Mono "₹800/hour") + capacity ("up to 6").
Hover: scale 1.02, border shifts to accent-primary, image zooms 1.05.
Mouse-move 3D tilt: rotateX ±4°, rotateY ±8° based on cursor position.
Reduced motion: skip tilt, keep hover.
```

### 7.3 Slot Picker (`src/components/slot-picker.tsx`)

```
Grid: 4 columns on mobile, 6 on desktop. Each slot is a button:
  default: bg-elevated, border-subtle, time in JetBrains Mono
  available: hover shows cyan border
  booked: strikethrough, 40% opacity, disabled
  selected: filled cyan, bg-deep text
Loading: shimmer skeleton (12 slots)
Empty state: "No slots left today — try tomorrow"
```

### 7.4 Booking Wizard Progress (`src/components/booking-progress.tsx`)

```
Horizontal 4-dot progress at top of booking page.
Each dot: 12px, border-subtle default, filled cyan when complete,
pulsing cyan when active. Line between dots fills left-to-right.
Labels under dots: "Zone · Time · Details · Confirm"
```

---

## 8. Image & Asset Plan

### 8.1 Logo (SVG, inline)

Mark: Overlapping ">" and "<" chevrons forming a stylized "G" — the first bracket cyan, the second warm orange. Wordmark: "GameOn" in Space Grotesk 700, slight letterspacing tightening.

### 8.2 Zone images (6)

User generates with Leonardo.ai / Bing Image Creator using the prompts below. Place in `/public/images/zones/`. Until then, use CSS gradients tinted with each zone's accent color.

**Image prompts (use with Leonardo/Bing/Ideogram):**

```
VR Arena (16:9, cinematic):
Subject: Two players wearing wireless VR headsets, mid-game, reaching into holographic displays. Setting: Dark high-ceilinged arena with volumetric fog, cyan LED strip lighting on the walls and floor. Composition: Wide-angle, low camera position, players silhouetted against glowing screens. Lighting: Rim light from screens, cool blue ambient, warm orange accent from distant monitors. Style: Cinematic photography, shallow depth of field, moody, premium gaming lounge aesthetic.

Flight Simulator (16:9):
Subject: A full-cockpit flight simulator with a pilot in headset at the controls, instruments glowing. Setting: Dark enclosed space, three curved monitors showing a Mumbai night-sky approach. Composition: Over-the-shoulder shot, cockpit controls in sharp focus, screens in soft focus. Lighting: Instrument panel glow, deep blue ambient. Style: Hyperreal photography, cinematic, premium.

Racing Cockpit (16:9):
Subject: A full-motion racing simulator rig with F1-style wheel and pedals, driver mid-corner, triple curved monitors showing a race track. Setting: Dark room, LED strip lighting red and cyan. Composition: Side angle, motion blur suggesting the rig is tilting. Lighting: Monitor glow dominant, warm red accent. Style: Dynamic sports photography, high contrast, premium.

Esports Station (16:9):
Subject: A row of high-end gaming PCs with RGB-lit setups, mechanical keyboards glowing, 240Hz curved monitors showing Valorant / Dota gameplay. Setting: Dark lounge with blue and purple accent lighting, high-back gaming chairs. Composition: Dolly shot down the row, slight motion blur on the far monitors. Lighting: Monitor-dominant, cool palette with purple accents. Style: Clean esports arena aesthetic, premium.

Console Lounge (16:9):
Subject: Low leather lounge seats around a large 4K OLED TV, two players holding PS5 controllers in a split-screen match. Setting: Warm, intimate space, orange accent lighting, dark wood paneling. Composition: Wide shot from behind the players. Lighting: Warm bulbs, orange and amber, screen glow. Style: Boutique lounge photography, premium.

Streaming Pod (16:9):
Subject: A single streamer at a soundproofed broadcast-ready pod — multiple cameras, condenser microphone, dual monitors, ring light. Setting: Dark compact booth with sound-dampening panels, pink and cyan RGB behind. Composition: Three-quarter view from inside the pod. Lighting: Ring light on face, RGB rim. Style: Modern creator studio, premium, hyperreal.
```

### 8.3 Café menu images

Use Unsplash free stock. Search terms: "nachos dark background", "burger moody", "mocktail neon", "fries closeup". Place in `/public/images/menu/`.

### 8.4 Icons

Lucide React, imported inline. Common ones: `Gamepad2`, `Clock`, `Users`, `Calendar`, `MapPin`, `Trophy`, `Zap`, `Headphones`, `Monitor`, `Flame`.

---

## 9. Copy Bank (ready to use)

### Hero
- Headline: `Powai's premier gaming café`
- Sub: `Six worlds. One roof. Zero compromises.`
- CTA 1: `Book a Session`
- CTA 2: `See Zones`

### Zones section intro
- Heading: `Choose your world`
- Sub: `From VR dogfights to F1 racing, every zone is a complete experience.`

### Pricing section intro
- Heading: `Pay as you play, or go all in`
- Sub: `Members get priority booking, better rates, and tournament invites.`

### Final CTA
- Heading: `Your rig is waiting`
- Sub: `Reserve a slot now — walk in anytime between 10 AM and 10 PM.`
- Button: `Book a Session`

### Confirmation page
- Heading: `You're in`
- Sub: `We've reserved your spot. Show this QR at the counter.`

### Empty states
- No slots: `No slots left today. Try tomorrow.`
- No bookings (admin): `No bookings yet. Share the site to start taking reservations.`

### Errors
- Generic: `Something broke on our end. Try again in a moment.`
- Slot taken: `That slot was just booked. Pick another?`
- Network: `We can't reach the server. Check your connection.`

---

## 10. Testing Checklist

Before marking the project done, verify:

- [ ] `npm run dev` starts without errors
- [ ] Landing page loads under 2s on dev
- [ ] All 6 zones visible and clickable
- [ ] Booking flow completes end-to-end (zone → date → time → details → confirm → see QR)
- [ ] Booking appears in admin dashboard
- [ ] Booking can be cancelled from admin — slot frees up
- [ ] All navbar links lead to populated pages
- [ ] Mobile layout works at 375px (no horizontal scroll)
- [ ] Keyboard-only navigation works for booking flow
- [ ] `prefers-reduced-motion` disables GSAP tilt + hero particles
- [ ] Lighthouse Performance ≥ 85, Accessibility ≥ 95
- [ ] No console errors or warnings
- [ ] `npm run build` succeeds with no type errors

---

## 11. The Prompt for Claude Code

> Copy everything in the fenced block below into Claude Code's first message.

```
You are building GameOn — a premium Dynamic Gaming Café website — as a
full Next.js 14 project in /home/claude/gameon. The site must look
production-quality (Awwwards-tier dark gaming aesthetic), animate smoothly
with GSAP, and ship as a static export that Capacitor can wrap into an
Android APK with minimal changes.

Read the full build spec at:
/tmp/claude-0/-home-claude/8b0eb743-09ab-51c0-9594-d2380036480c/scratchpad/GameOn_Claude_Code_Handoff.md

Execute the five phases in order:
  Phase 1 — Scaffold + Backend
  Phase 2 — Core Pages (landing, booking wizard, confirmation)
  Phase 3 — Secondary Pages (events, menu, membership, zone detail)
  Phase 4 — Admin + Polish (admin dashboard, 404, responsive, a11y, perf)
  Phase 5 — APK Preparation (static export + Capacitor — only when I say)

Hard requirements:
  - TypeScript everywhere, strict mode
  - Design tokens exactly as specified in section 3.1
  - Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (data)
  - Dark theme only, no light-mode toggle for v1
  - shadcn/ui components only; no other UI libraries
  - GSAP for all non-trivial animations; respect prefers-reduced-motion
  - better-sqlite3 for the demo database (file-based, zero-config)
  - All backend logic in Next.js API routes, not external services
  - Mobile-first responsive — test at 375px, 768px, 1440px

Before writing UI code for any new section, invoke the frontend-design
skill to confirm the palette/type choices still feel distinctive, not
templated. Use the 21st:21st-ui skill when you need inspiration for a
component you have not built before (hero, pricing table, etc.).

Design hard rules (do not break any):
  - No ALL CAPS labels
  - No single-word color accents in headlines ("book NOW")
  - No numbered markers (01/02/03) unless truly a sequence
  - No "WORD — fragment" em dash labels
  - No "→" arrow appended to CTAs
  - No warm cream + terracotta palette (AI tell)
  - No generic SaaS-card kit (uniform radius + grey shadow on everything)

Images: use CSS gradients (tinted with each zone's accent color) as
placeholders in /public/images/zones/ for now — I will generate real
images with Leonardo.ai using the prompts in section 8.2 of the spec and
drop them in later.

Build in this order:
  1. Scaffold Next.js, install deps, init shadcn, add tokens → test
  2. Build the backend end-to-end, test with curl before any UI
  3. Build the hero + navbar + footer, verify the look
  4. Build the booking wizard end-to-end — this is the demo-critical path
  5. Build secondary pages
  6. Admin + polish

Use a TodoWrite task list to track phases. Mark each phase complete only
after its exit criteria pass. Run npm run build and lint at the end of
each phase to catch type errors early.

When each phase finishes, show me:
  - What you built
  - A screenshot or screen recording if possible
  - Anything you had to deviate from the spec on, and why

Start with Phase 1.1 — initialize the Next.js project.
```

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Static export breaks API routes → APK can't book | Deploy the Next.js app with API routes to Vercel; APK WebView points to hosted URL |
| GSAP license concern for commercial APK | GSAP core + ScrollTrigger are free for commercial use since v3.13 (2024). Confirm if plugins like SplitText / MorphSVG are used |
| better-sqlite3 is native and won't run in a WebView | Correct — the DB lives on the server, not inside the APK. The APK is just the WebView; data comes over HTTPS from the hosted backend |
| Capacitor WebView performance on low-end Android | Keep bundle size small, lazy-load route chunks, prefer CSS animations over GSAP for things that don't need JS |
| Fonts don't load offline in APK | Self-host fonts in `/public/fonts/` instead of Google Fonts CDN |

---

## 13. Post-Build Next Steps

Once the demo is working:

1. **Deploy** — push to Vercel for live URL (free tier is enough)
2. **Generate real images** — user runs the prompts in section 8.2 through Leonardo.ai
3. **Replace gradients with images** — swap placeholder gradients for real photos in `/public/images/zones/`
4. **Capacitor APK** — run phase 5 to produce installable `.apk`
5. **Pitch deck** — standalone deliverable; take screenshots of the live site for the pitch
6. **Submit for Entrepreneurship project** — site URL + APK + GameOn_Entrepreneurship_Assignment.docx (already built)

---

**End of handoff document.** The next action is yours: open Claude Code, paste the prompt in section 11, and let it build.
