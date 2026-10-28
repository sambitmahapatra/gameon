# Enhancement implementation

Implemented the requested GameOn brand copy, Indian café menu, photography, logo pack and motion pass.

## Fixes

- Hero words have CSS margins; GameOn and the italic tagline share the word reveal.
- Silver has both `tier` and `tier--highlight` classes on landing and membership pages, with a visible badge and flex-aligned buttons.
- Replaced class-string concatenation with `cn()` for pricing, sticky navigation, reversed experience rows and hero words. The Tailwind formatter stripped the leading spaces in the original expressions.
- Booking retains the selected time when advancing to details and review; an invalid zone query returns to zone selection.
- QR codes have a four-module quiet zone and a white background in both themes.
- Floating labels follow real input content, including autofill and form resets.

## Brand assets

- `public/logo-mark.svg`, `logo-lockup.svg`, `logo.svg`, `logo.png`, `favicon.svg`, `favicon.ico`, 16/32px PNG favicons and the 180px Apple icon.
- `public/og-image.png`: 1200×630 branded orbital social image.
- Six zone photos, three portrait experience photos, 22 dish photos and a café hero in `public/images/`.
- Photography used the built-in ImageGen tool. The final prompt set is [image-prompts.json](../../scripts/image-prompts.json). SVG logos and the social composition are code-native vector artwork, rasterized by [brand-assets.mjs](../../scripts/brand-assets.mjs).
- All 32 WebP photos have verified dimensions and are below 200,000 bytes each. The original generated files remain in Codex's generated-image storage; the local source mapping is in ignored `.cache/image-sources.json`.
- [Asset contact sheet](asset-contact-sheet.jpg) covers every photo. Menu prices, descriptions and dietary flags are in `src/lib/data/menu.ts`.

## Motion

Added template entry transitions, hero orbital parallax and a fine-pointer cursor glow, staggered zone reveals, image skeletons and load fades, a pricing GSAP timeline with a Silver pulse, live-counter rolls, confirmation headline/QR/confetti effects, scroll progress, menu tab transitions, floating labels, click-origin ripples, broken-orbit 404 art, scroll-driven character reveals and mobile drawer link staggering. Reduced-motion preferences disable decorative movement; GSAP effects revert when the preference changes. Booking progress reflects reservation state rather than suggesting check-in has happened on scroll.

## Verification

Passed:

- ESLint and TypeScript.
- Production build in `.next-verify` (network access was needed for existing Google Font configuration).
- Prettier and `git diff --check`.
- `node scripts/verify-assets.mjs`: dimensions and size limits for all 32 photos.
- `node scripts/verify-enhancement.mjs`: eleven public pages, brand-leading titles, corrected Silver markup, 404, invalid booking validation, reservation creation, confirmation QR markup, duplicate-slot conflict and cancellation. This ran at `http://localhost:3100` with isolated `data/enhancement-verify.db`.

The photography contact sheet, refined combo/café photos and social image were visually inspected. Live browser verification, dark/light screenshots, 375px checks, keyboard-only booking and Lighthouse remain outstanding: no browser connector is available. The previous native Chrome attempt was stopped because the helper could not confidently determine the current URL; the final retry reported that the GameOn window was minimized, and launching Chrome did not restore that window. No browser-based pass is claimed.

To rerun the isolated production smoke test in PowerShell after building:

```powershell
$env:NEXT_DIST_DIR = '.next-verify'
$env:DATABASE_PATH = Join-Path (Get-Location) 'data/enhancement-verify.db'
npm run start -- -p 3100
# In another terminal:
node scripts/verify-enhancement.mjs
```
