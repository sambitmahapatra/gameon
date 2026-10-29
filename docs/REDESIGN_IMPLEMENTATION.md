# GameOn social club redesign

Implemented from `docs/gameon-redesign/index.html` in the existing Next.js app. Hosting remains Vercel, with Supabase PostgreSQL for production and SQLite for isolated local previews. No database migration or new environment variable is required.

## Content and backend mapping

| Proposed label         | Inventory / action                                      |
| ---------------------- | ------------------------------------------------------- |
| Console Lounge         | `console-lounge`                                        |
| VR Arena               | `vr-arena`                                              |
| Racing Rigs            | `racing-cockpit`                                        |
| Flight Deck            | `flight-sim`                                            |
| Competitive Arena      | `esports-station`                                       |
| Arcade Corner          | Counter enquiry; no invented hourly inventory or price  |
| Streaming Pod          | Existing inventory retained in booking and zone details |
| Bronze / Silver / Gold | Existing `/api/members`, ₹999 / ₹2,499 / ₹4,999 monthly |
| Rivalry Night          | Console event from live calendar                        |
| Time Attack            | Sim racing event from live calendar                     |
| Community Cup          | Monthly event from live calendar                        |
| Private Takeover       | Group enquiry to existing venue contact                 |

Homepage bookings read `/api/slots`, POST `/api/bookings`, then navigate to the existing confirmation/QR route. Backend IDs, prices, capacities and conflict handling are authoritative. Display labels use `src/lib/data/club.ts` without rewriting existing bookings. Event cards show the actual event title, date and remaining places; registration uses its real event ID.

The café features the supplied food headings and imagery, deep-linked to menu categories. Existing priced dishes are retained. The proposed burger and pizza combo have no supplied prices or dietary details, so the menu asks visitors to confirm at the counter and does not assign dietary markers. No payment or food-order API is implied.

## Assets

Reference photographs are optimized local WebP files under `public/images/club/`. Original Unsplash photo IDs from the supplied HTML:

- Hero / competitive: `1542751371-adc38448a05e`
- Console: `1603481546238-487240415921`
- Immersion: `1593305841991-05c297ba4575`
- Racing / occasion: `1511512578047-dfb367046420`
- Flight: `1436491865332-7a61a109cc05`
- Arcade / community: `1550745165-9bc0b252726f`
- Burger: `1568901346375-23c9450c58cd`
- Sides: `1579751626657-72bc17010498`
- Pizza: `1513104890138-7c749659a591`

The reference's social/café and cooler URLs returned 404. These use the existing local café and virgin mojito assets instead. No additional generation was needed.

Barlow Condensed and DM Sans are bundled from Google's official `google/fonts` repository; their OFL licenses are included under `public/fonts`. Build and runtime do not require a font CDN.

## Interaction and checks

- System theme preference, persistent manual toggle, shared color tokens across all routes.
- Hero entrance and scroll parallax, staggered section reveals, image hover zoom, animated ticker and button motion.
- Reduced-motion mode disables movement; content remains available without animation initialization.
- Responsive layouts and accessible labels, keyboard controls, mobile drawer and focus states.
- `npm run build` and `npm run build:static` validate both deployment modes.
- `VERIFY_URL=http://localhost:3112 node scripts/verify-enhancement.mjs` checks the booking lifecycle against an isolated preview.
- `VERIFY_URL=http://localhost:3112 node scripts/verify-redesign.mjs` checks bundled assets, membership registration and event persistence. Never point verification at a production database.
