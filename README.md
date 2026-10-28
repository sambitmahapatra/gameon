# GameOn

Marketing and booking site for **GameOn**, a dynamic gaming café in Hiranandani Gardens,
Powai, Mumbai. Six zones under one roof — VR arena, flight simulator, racing cockpits,
esports stations, console lounge, streaming pods — plus a café and a membership tier system.

The same codebase is the source for the Android APK: it builds either as a server app with
working API routes, or as a static export that Capacitor wraps (see
[docs/APK.md](docs/APK.md)).

|        |                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------- |
| Stack  | Next.js 14 (App Router, TypeScript strict), Tailwind v3, shadcn-style Radix primitives, GSAP   |
| Data   | better-sqlite3, file-based at `data/gameon.db`, seeded on first run                            |
| Design | Dark only. Tokens, type scale and motion rules in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Spec   | [docs/GameOn_Claude_Code_Handoff.md](docs/GameOn_Claude_Code_Handoff.md)                       |

## Getting started

```bash
npm install
cp .env.example .env.local     # optional: the defaults work as-is
npm run db:seed                # creates data/gameon.db with 6 zones and 30 days of slots
npm run dev                    # http://localhost:3000
```

The database seeds itself on first request too, so `npm run dev` alone is enough.

The staff dashboard is at `/admin?key=gameon-demo` (change `ADMIN_KEY` before deploying).

## Scripts

| Script                            | What it does                                        |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Dev server with hot reload                          |
| `npm run build`                   | Production build with API routes (the website)      |
| `npm run build:static`            | Static export into `./out` for the Capacitor APK    |
| `npm start`                       | Serve the production build                          |
| `npm run lint`                    | ESLint via `next lint`                              |
| `npm run typecheck`               | `tsc --noEmit`                                      |
| `npm run format` / `format:check` | Prettier                                            |
| `npm run db:seed`                 | Create or top up `data/gameon.db`                   |
| `npm run db:reset`                | Delete the database and reseed from scratch         |
| `npm run verify`                  | lint, typecheck and build — run this before pushing |

## Repository layout

```
src/
  app/
    page.tsx                    landing page (hero, zones, pricing, tournaments, CTA)
    book/                       four-step booking wizard
      confirm/[id]/             confirmation: QR, ICS download, timeline, cancel
    events/  menu/  membership/ secondary pages
    zones/[slug]/               one page per zone, generated from the database
    admin/                      staff dashboard behind an ADMIN_KEY query gate
    api/                        zones, slots, bookings, events, members, stats, live-count
    layout.tsx                  fonts, metadata, navbar, footer, toaster
    globals.css                 design tokens as CSS variables
  components/
    ui/                         shadcn-style primitives (owned source, Radix under the hood)
    sections/                   landing page sections
    motion/                     GSAP reveal wrapper
    admin/                      dashboard table
  lib/
    db.ts                       schema, prepared statements, typed query helpers
    seed.ts                     idempotent zone, slot, event and member seed
    validation.ts               zod schemas shared by forms and API routes
    render-mode.ts              server-rendered vs static-export switch
    data/                       menu and membership content
  hooks/
scripts/
  seed.ts                       npm run db:seed
  build-static.mjs              parks API and admin routes, then exports
docs/                           architecture, git workflow, APK steps, image prompts
data/                           SQLite file (gitignored)
```

## How the two build modes work

API routes and a SQLite file cannot exist inside a static export, so:

- **Website** — `npm run build`. Pages render on demand (`force-dynamic`), API routes work,
  bookings hit the local database.
- **Static export** — `npm run build:static`. `scripts/build-static.mjs` moves `src/app/api`
  and `src/app/admin` aside, builds with `NEXT_OUTPUT=export` (pages switch to
  `force-static` through `src/lib/render-mode.ts`), then puts them back. The exported
  bundle talks to a hosted backend through `NEXT_PUBLIC_API_BASE`.

The recommended APK setup keeps `server.url` in `capacitor.config.ts` pointed at the
deployed site, so the WebView uses the live app and every route works.

## Current state

| Phase                    | Status                                                                                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Scaffold and backend | Done. All endpoints verified end to end, including slot conflict and cancel-frees-slot.                                                                                           |
| 2 — Core pages           | Done. Landing, booking wizard, confirmation with QR.                                                                                                                              |
| 3 — Secondary pages      | Done. Events, menu, membership, zone detail.                                                                                                                                      |
| 4 — Admin and polish     | Done. Dashboard, 404, error boundary, loading states, focus rings, reduced-motion.                                                                                                |
| 5 — APK                  | Scaffolded, not run. `capacitor.config.ts` and `build:static` are in place; installing Capacitor and generating the signed APK needs Android Studio ([docs/APK.md](docs/APK.md)). |

Zone and gallery artwork is still placeholder gradients tinted with each zone's accent
colour. Generate the photos with the prompts in [docs/IMAGE_PROMPTS.md](docs/IMAGE_PROMPTS.md),
drop them into `public/images/zones/`, then add the zone id to `WITH_ARTWORK` in
`src/lib/zone-images.ts`.

## Contributing

Branching, commit format and the pre-push checklist are in
[docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md). Short version: branch off `main`, use
Conventional Commits, run `npm run verify` before pushing.
