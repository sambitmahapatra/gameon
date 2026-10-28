# Architecture

## Design tokens

Defined once as CSS variables in `src/app/globals.css`, exposed to Tailwind in
`tailwind.config.ts`. Values are HSL triples so opacity modifiers (`bg-cyan/10`) work.

Two themes share one set of names: the light values sit on `:root`, the dark values on
`.dark`. `next-themes` toggles that class (`src/components/theme-provider.tsx`,
`attribute="class"`, dark by default, system preference honoured), so every component
reads the same token in either theme and nothing is themed twice.

| Token              | Dark      | Light     | Tailwind                 | Use                           |
| ------------------ | --------- | --------- | ------------------------ | ----------------------------- |
| `--bg-deep`        | `#0A0E17` | `#FAFAF7` | `bg-deep`                | Page background               |
| `--bg-surface`     | `#141B2D` | `#FFFFFF` | `bg-surface`             | Cards, panels, nav            |
| `--bg-elevated`    | `#1C2541` | `#F2F4F0` | `bg-elevated`            | Hover, active panels, dialogs |
| `--accent-primary` | `#00E5FF` | `#0066CC` | `text-cyan`, `bg-cyan`   | CTAs, active states           |
| `--accent-warm`    | `#FF6B35` | `#D84315` | `text-ember`, `bg-ember` | Secondary actions, badges     |
| `--text-primary`   | `#E8ECF1` | `#0A0E17` | `text-foreground`        | Body text                     |
| `--text-muted`     | `#8B95A7` | `#5A6478` | `text-muted-foreground`  | Labels, meta                  |
| `--border-subtle`  | `#1F2A44` | `#E6E8E3` | `border-border`          | Dividers, card borders        |

The light accents are darker than the dark-theme ones on purpose: cyan `#00E5FF` on white
measures about 1.5:1. `--on-accent` and `--on-warm` carry the text colour that belongs on
each accent (white in light, `--bg-deep` in dark) and back `cyan.foreground` /
`ember.foreground`, so a filled button never has to guess.

Three more tokens vary by theme rather than by component: `--grain-overlay` and
`--spotlight` (both weaker in light, where noise reads as dirt), and `--card-shadow` plus
`--card-highlight`, which the `.panel` class uses for its shadow and its 1px top sheen.
`.panel` is the standard card surface — border, background, shadow and highlight in one
class — and replaces hand-written `rounded-card border bg-surface` stacks.

shadcn's `--background`, `--primary`, `--card` and friends alias these, so stock shadcn
component source drops in without edits.

### Type

`Space Grotesk` for display (`font-display`), `Inter` for body (`font-sans`),
`JetBrains Mono` for data (`font-mono`), all loaded through `next/font/google` in
`src/app/layout.tsx`. Named sizes, fluid where the spec's fixed sizes would overflow a
375px screen: `text-hero`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-meta`,
`text-data`.

### Radii

Deliberately not uniform: `rounded-button` 8px, `rounded-card` 12px, `rounded-modal` 24px.

## Imagery

`src/lib/images.ts` maps each zone to an Unsplash photo id and builds the URL with the
crop and width the call site needs (`zoneImage`, `signatureImage`, `heroImage`), with one
shared base64 `BLUR_DATA_URL` as the placeholder for all of them. `LOCAL_ARTWORK` is the
override hook: drop generated artwork in `public/` and list it there, and that zone stops
pointing at Unsplash without any component change.

Photos always render through `next/image` with `fill` and an explicit `sizes`, inside
`components/zone-visual.tsx`. That wrapper paints the zone's accent mesh first, so a slow
or failed image still leaves a coloured surface rather than a hole, then lays an accent
veil and the `--image-wash` overlay on top to keep white text legible in both themes.
`next.config.mjs` allows exactly one remote host, `images.unsplash.com`.

## Motion

GSAP with ScrollTrigger, registered once in `src/lib/gsap.ts` and always driven through
`useGSAP` so timelines and triggers die with their component.

Every animated component first reads `useReducedMotion()`, which **starts at `true`** —
nothing moves until the client has confirmed the preference, so there is no flash of
movement. Under reduced motion each component sets its final state directly instead of
tweening, and `globals.css` additionally collapses CSS animations and transitions.

| Where                                 | What                                                                                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/hero.tsx`                 | One orchestrated entrance: particles converge on the logo mark, tagline types in per character, sub-line and CTAs rise                        |
| `components/motion/reveal.tsx`        | Fade-and-rise on section entry; one ScrollTrigger per wrapper, optional child stagger                                                         |
| `components/zone-card.tsx`            | Cursor-following 3D tilt, max 4° X and 8° Y, via `gsap.quickTo`                                                                               |
| `components/slot-picker.tsx`          | Slots scale and fade in as they become selectable                                                                                             |
| `components/sections/stats-strip.tsx` | Counters roll up once, on scroll                                                                                                              |
| `components/booking-timeline.tsx`     | Scroll-scrubbed dot along the Reserved → En route → Checked in line                                                                           |
| `components/hero.tsx`                 | Headline words wipe up behind a clip-path, sub-line de-blurs, stats count up                                                                  |
| `components/zone-card.tsx`            | Four states: 40px scroll-in with a settling photo, 6px hover lift with an accent ring pulse, cursor tilt with 4px photo parallax, press flash |
| `components/section-heading.tsx`      | Framer Motion `whileInView` reveals the heading character by character and types the eyebrow in                                               |
| `components/booking-wizard.tsx`       | Steps slide in from the side they came from (`AnimatePresence mode="wait"`)                                                                   |
| `components/booking-progress.tsx`     | Line fills on an eased tween; the active dot pulses a ring                                                                                    |
| `components/live-counter.tsx`         | Ring expands out of the live dot on a loop                                                                                                    |
| `components/qr-reveal.tsx`            | QR modules scale in from the centre of the grid                                                                                               |
| `components/magnetic.tsx`             | CTAs drift up to 8px toward a cursor inside 60px                                                                                              |

Framer Motion sits alongside GSAP rather than replacing it: GSAP keeps the scroll-driven
and imperative work (ScrollTrigger, `quickTo` tilts, timelines), Framer handles the
declarative in-view reveals and the wizard's step transitions, which are far shorter
written as variants.

### Depth and guardrails

Grain (`components/grain.tsx`) is one fixed data-URI noise layer at `z-60` with
`mix-blend-overlay`; the spotlight (`components/spotlight.tsx`) is a lerped radial
gradient that only mounts for fine pointers with hover. Section backgrounds use the
`.mesh-*` utilities in `globals.css` — drifting blobs behind the hero, opposing corner
washes on the zones and pricing sections, and a rotating conic behind the final CTA.

Everything animates `transform` and `opacity` only, with two deliberate exceptions: the
one-shot `glow-once` box-shadow on a primary button hover, and the `background-position`
sweep of the `.shine` sheen. Mesh layers are blurred, composited and paused under
`prefers-reduced-motion`, which `globals.css` enforces globally on top of each
component's own `useReducedMotion()` check.

## Data layer

`src/lib/db.ts` owns the connection, the schema and every query. Rules it follows:

- One connection per process, cached on `globalThis` so dev reloads do not leak handles
- WAL journal mode, foreign keys on
- Prepared statements only; no string interpolation of user input
- Writes that touch two tables run inside `db.transaction(...)`

The booking insert is the one piece of real concurrency control:

```sql
UPDATE slots SET booked = 1 WHERE id = ? AND zone_id = ? AND booked = 0
```

Zero rows changed means someone else took the slot, so the transaction throws
`SlotUnavailableError`, the API answers 409, and the wizard sends the user back to a
refreshed grid. Cancelling reverses both sides in one transaction.

`src/lib/bootstrap.ts` wraps every server read in `withDb()`, which seeds the database on
first use. `src/lib/seed.ts` is idempotent: zones and events upsert, slots insert with
`ON CONFLICT DO NOTHING`, and the random occupancy pass only runs on a genuinely empty
database so it never disturbs real bookings.

## API

All routes are `force-dynamic` and send `Cache-Control: no-store`.

| Route                           | Method      | Notes                                                |
| ------------------------------- | ----------- | ---------------------------------------------------- |
| `/api/zones`                    | GET         | All six zones                                        |
| `/api/slots?zoneId=&date=`      | GET         | A day's slots; `date` validated as `YYYY-MM-DD`      |
| `/api/bookings`                 | POST        | zod-validated; 409 on a taken slot, 422 on bad input |
| `/api/bookings?key=`            | GET         | Admin listing, shared-key guard                      |
| `/api/bookings/[id]`            | GET, DELETE | Fetch one; DELETE cancels and frees the slot         |
| `/api/events`                   | GET, POST   | List and register                                    |
| `/api/members`                  | POST        | Membership sign-up                                   |
| `/api/stats`, `/api/live-count` | GET         | Landing counters and the navbar ticker               |

`src/lib/validation.ts` holds the zod schemas, used by both the forms and the routes, so
client and server agree on what a valid phone number is.

## Render modes

`src/lib/render-mode.ts` exports `dynamic`, which pages re-export. It is `force-dynamic`
for the website and `force-static` when `NEXT_OUTPUT=export`, which is what makes one
codebase serve both the site and the APK bundle. See the README for the full picture.

## Accessibility

- Cyan `:focus-visible` ring on everything interactive, with a deep-background offset
- Skip link as the first focusable element
- Slot grid, filter chips and party-size slider are real buttons, inputs and a Radix
  slider — the whole booking flow is keyboard operable
- Decorative gradients, particles and the timeline dot are `aria-hidden`; the hero
  headline carries an `aria-label` because it is split into per-character spans
- Status is never colour-only: cancelled bookings say "cancelled", veg markers have
  `title` and `aria-label`, event progress bars expose `aria-valuenow`
- Both themes clear AA on every token pair, which is why the light accents are not the
  dark ones reused; the theme toggle is a labelled button, and `<html>` carries
  `suppressHydrationWarning` because `next-themes` writes the class before paint
- Split text keeps its accessible name on the parent (`aria-label` on the heading, spans
  `aria-hidden`), and the QR code is a server-rendered `role="img"` matrix, so it scans
  whether or not the reveal animation runs
- Floating labels are real `<label for>` elements that move, not placeholders

## Deliberate deviations from the spec

| Spec                                               | What was built                                                  | Why                                                                                                                                                                                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx create-next-app` then `npx shadcn init`       | Hand-written scaffold and primitives                            | Both CLIs prompt interactively; the generated output would have been overwritten by the locked tokens anyway. The primitives are the same Radix-based source shadcn would have vendored                                                |
| better-sqlite3 11.x                                | 12.x                                                            | 11.x has no prebuilt binary for Node 24, and this machine has no Python or MSVC toolchain to compile it                                                                                                                                |
| `@types/uuid`                                      | Not installed                                                   | uuid 11 ships its own types; the package is deprecated                                                                                                                                                                                 |
| "Every page gets a `loading.tsx`"                  | All except `/`, `/book` and the two dynamic routes              | A parent Suspense boundary flushes a 200 before `notFound()` can set the status, which broke 404s on `/zones/[slug]` and `/book/confirm/[id]`. The pages it was removed from read SQLite synchronously, so the skeleton never rendered |
| Zone photos                                        | Accent-tinted gradients                                         | Artwork is generated externally; `src/lib/zone-images.ts` is the switch-over point                                                                                                                                                     |
| Hero headline "assembles from scattered particles" | Particles converge on the logo mark, then the headline types in | Splitting the headline into particles needs GSAP SplitText, a paid plugin. The free-plugin result keeps the same beat                                                                                                                  |
