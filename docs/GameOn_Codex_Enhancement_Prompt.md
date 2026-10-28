# GameOn — Codex Enhancement Pass

## What's happening

Claude Code built the GameOn website in `/home/claude/gameon` based on an approved design reference. The build is **90% there** — hero animation works, zone SVG art renders, booking flow is functional. But there are specific **bugs to fix**, **content to swap**, **real images to generate**, and **more polish to add**.

You (Codex) have **image generation** available through GPT Image / DALL·E 3. Use it to replace the inline SVG placeholders with photorealistic hero and menu images, generate a proper logo, and lift the whole site from "designed well" to "has a real brand identity."

Work in phases. Do not try to do everything at once. Fix bugs first, then content, then images, then polish.

---

## Phase 1 — Bugs to fix immediately

Open `localhost:3000` and verify each after fixing.

### 1.1 Hero headline words are joined

The hero shows "**Sixworlds. Oneroof.**" (no spaces). Each word is wrapped in `<span class="word"><span>text</span></span>`, and the inline-block spans eat the whitespace between them.

Fix in `src/components/HeroSection.tsx` (or wherever the hero headline is rendered): either add `{" "}` between word spans in JSX, or add `margin-right: 0.3em` to `.hero h1 .word` in CSS. Both work. Pick the CSS fix because it survives any JSX reformatting.

```css
.hero h1 .word { margin-right: 0.25em; }
.hero h1 .word:last-child { margin-right: 0; }
```

Since you're also changing the tagline (Section 2.1), the new copy must not re-introduce this issue.

### 1.2 Silver pricing tier is broken

Screenshot shows: the "Most picked" badge is missing from the Silver tier, its content doesn't align with the other tiers' top edges, and the "Become a Silver member" button sits in the middle of the card instead of pinned to the bottom.

Three things to check in `src/components/PricingTiers.tsx`:

1. **Badge absolute positioning** — the parent `.tier--highlight` needs `position: relative; overflow: visible`. If a parent sets `overflow: hidden`, the badge (which uses `top: -11px`) gets clipped and vanishes.
2. **Flex column alignment** — every `.tier` must be `display: flex; flex-direction: column`, the `<ul>` must have `flex: 1`, and the button must be the last child. This pins the button to the bottom regardless of how many list items.
3. **List item parity** — Silver has 5 bullets, others have 4. That's fine; the flex layout handles it. But Silver's content block (name + price + sub) must start at the same vertical position as the others. Check that nothing adds extra top-padding to `.tier--highlight`.

Expected result: all four tier cards align at the top AND at the button row, regardless of list length.

### 1.3 Any other visible mis-renders

Walk the live site in both themes and note anything else that looks wrong. Common suspects after a design port:
- Grain overlay missing or blocking content (check z-index)
- Mesh gradient visible as hard-edged blob instead of blurred
- Zone card tilt skipping (check `data-tilt` is set on the article element)
- "Live now" dot pulse ring missing (check the ::before pseudo-element)
- Footer flowing gradient line missing (check the ::before on footer)
- Theme toggle icon not swapping

Fix each with a one-line note.

---

## Phase 2 — Content changes

### 2.1 New brand tagline (remove "Six worlds. One roof.")

The brand mark on every page is **"GameOn"**. The hero needs a new tagline. Pick ONE of these (I rank-order my preference):

1. **"Enter another world."** — plays on VR + metaphorical ambition. Three words. Reads as a brand promise.
2. **"Gaming, grown up."** — positions directly against gritty internet cafés.
3. **"Six rigs. One roof. Properly."** — specific; keeps the "six/one" cadence that worked.
4. **"Play like you mean it."** — direct, action-oriented.

Go with **"Enter another world."** unless you have a strong reason otherwise.

Full hero copy block:

```
Eyebrow:  The flagship opens this quarter
Brand:    GameOn
Tagline:  Enter another world.
Sub:      A grown-up gaming lounge. VR free-roam, a real 737 cockpit,
          motion racing rigs, tournament PCs, a console lounge and
          streaming pods — in one serious premium venue, with a café
          that actually feeds you.
CTAs:     Reserve a rig  ·  See the zones
```

Visual treatment: "**GameOn**" set at hero-display scale in Bricolage Grotesque 800, then "Enter another world." on a new line in Bricolage Grotesque italic. The old clip-path word reveal animation runs across both lines.

Update `<title>` tags site-wide to lead with the brand: `GameOn — Enter another world.` and page-specific sub-titles (`GameOn — Book a session`, etc).

### 2.2 Indian café menu (replace current menu items)

Replace every item in `src/app/menu/page.tsx`. The brief: Indian-forward gaming-café food, chicken-only non-veg (no mutton, no beef, no pork, no seafood). Prices in INR.

#### Snacks — "One-handed, built for mid-match"

| Item | Veg | Price | Description |
|---|---|---|---|
| Chilli Paneer Poppers | 🟢 | ₹260 | Crisp paneer tossed in sweet chilli, spring onion. |
| Chicken 65 | 🔴 | ₹290 | Guntur chilli, curry leaves, lime. Signature. |
| Masala Fries | 🟢 | ₹180 | Hand-cut, double-fried, chaat masala and lime. |
| Peri Peri Chicken Wings | 🔴 | ₹340 | Six wings, mild / medium / hot. Blue-cheese dip. |
| Papdi Chaat Cups | 🟢 | ₹220 | Yogurt, tamarind, pomegranate, sev. Six cups. |
| Chicken Keema Pav Sliders | 🔴 | ₹290 | Two Mumbai-style sliders on buttered pav. |

#### Mains — "Order between rounds, eat at your rig"

| Item | Veg | Price | Description |
|---|---|---|---|
| Butter Chicken with Naan | 🔴 | ₹420 | Tomato-cream gravy, butter naan on the side. |
| Paneer Butter Masala Bowl | 🟢 | ₹360 | Served with jeera rice. The all-timer. |
| Chicken Biryani Pot | 🔴 | ₹380 | Dum-cooked, boiled egg, raita, salan. |
| Veg Hakka Noodles | 🟢 | ₹280 | Wok-tossed, Schezwan on request. |
| Dal Khichdi Comfort Bowl | 🟢 | ₹240 | Ghee, roasted papad, pickle, curd. |
| Grilled Chicken Sandwich | 🔴 | ₹320 | Herb-grilled chicken, cheese, pesto, sourdough. |

#### Drinks — "Caffeine, sugar, and cold things"

| Item | Price | Description |
|---|---|---|
| Masala Chai | ₹80 | Our own blend. Served in a kulhad. |
| Cold Coffee with Ice Cream | ₹180 | Vanilla scoop, cocoa dust. |
| Mango Lassi | ₹160 | Alphonso pulp, cardamom. Seasonal. |
| Fresh Lime Soda | ₹110 | Sweet, salt or mixed. |
| Blue Lagoon Mocktail | ₹190 | Blue curaçao, lime, sprite, no alcohol. |
| Virgin Mojito | ₹180 | Lime, mint, soda, demerara. |

#### Combos — "Built for a 90-minute session"

| Combo | Price | Includes |
|---|---|---|
| Gamer's Combo | ₹480 | Chicken sandwich + fries + cold coffee |
| Match Day Platter (for 2) | ₹780 | Wings + poppers + papdi chaat + two drinks |
| Victory Meal | ₹520 | Chicken biryani + lassi + gulab jamun |
| Streamer's Fuel | ₹340 | Masala fries + chai + chocolate brownie |

Design: tab layout stays (shadcn Tabs: Snacks · Mains · Drinks · Combos). Each item gets a small image (120×120, rounded), description to the right, price in JetBrains Mono. Vegetarian indicator = small green square top-left of image; non-veg = small red triangle.

Keep "Order at counter — delivered to any zone within 10 minutes." as the page footer note.

---

## Phase 3 — Image generation (use GPT Image / DALL·E 3)

Generate every image at the specified aspect ratio and save to `public/images/{category}/{slug}.webp` (or `.png` if your pipeline can't convert). After generation, update the components that referenced the inline SVGs to use the real images, and keep the SVG as the fallback / blur-placeholder.

### 3.1 Logo

**File:** `public/logo.svg` (and `public/logo.png` for favicon)

**Prompt for GPT Image:**

> Minimalist logo mark for "GameOn", a premium gaming lounge. The mark is a geometric monogram: an angular "G" formed by two overlapping chevron brackets ("<" and ">"), rendered in a modern geometric style. The negative space inside the G reads subtly as the letter "O". Clean vector style, 2px stroke weight, perfect geometry. Primary color: electric cyan (#00F0FF). Dark navy background (#06080F). The mark is centered, with generous whitespace. No text, no wordmark, no shadows, no gradients. Flat vector only. Icon style, suitable for app and favicon use. 1:1 square aspect ratio.

Also generate a wordmark version:

> The word "GameOn" set in a bold geometric sans-serif typeface (Bricolage Grotesque 800 or similar), tight letter-spacing, slightly condensed. Electric cyan (#00F0FF) on dark navy (#06080F) background. The "G" has an extended tail that connects to the chevron mark from the previous image, forming a lockup. No tagline, no shadow, no gradient. 3:1 aspect ratio.

Save at:
- `public/logo-mark.svg` — mark only, for favicon + mobile nav
- `public/logo-lockup.svg` — mark + wordmark, for desktop nav + footer
- `public/favicon.ico` — generated from the mark

Replace the current inline SVG in `src/components/Navbar.tsx` and `Footer.tsx` with these.

### 3.2 Six zone hero images

Each goes behind the inline SVG as the actual background. Keep the SVG as an overlay for the branded art direction, but let the real photo be the base layer at 60% opacity blended into the dark gradient.

**File naming:** `public/images/zones/{slug}.webp`

#### VR Arena — `public/images/zones/vr-arena.webp`

> Cinematic wide-angle photograph of a dark high-ceilinged VR arena. Two players in the mid-ground wearing wireless VR headsets, arms raised as if reaching into holographic space. Volumetric fog filling the room, cyan LED strips lining the walls and floor. The players are silhouetted against distant glowing screens. Rim light in cool cyan, warm orange accents from distant monitors. Shallow depth of field, 16:9 aspect ratio, premium gaming lounge aesthetic. Photorealistic, hyper-detailed, moody color grading. No text, no logos. 1920×1080.

#### Flight Simulator — `public/images/zones/flight-sim.webp`

> Cinematic photograph taken from inside a full flight simulator cockpit. A pilot wearing a headset at the controls, instruments and panel switches softly glowing in amber. Through the three curved monitors ahead: a night approach to Mumbai with distant city lights and runway strip visible. Over-the-shoulder composition, cockpit controls in sharp focus. Instrument panel glow dominant, deep blue ambient. Hyperreal, cinematic, premium. 1920×1080.

#### Racing Cockpit — `public/images/zones/racing-cockpit.webp`

> Cinematic photograph of a full-motion racing simulator rig at an angle, driver in racing seat mid-corner with hands on an F1-style wheel, legs on three pedals. Triple curved monitors showing a race track in motion blur. Dark room with red and cyan LED strip lighting. Side angle emphasizing the hydraulic tilt of the rig. Monitor glow dominant, warm red accent lighting. Dynamic sports photography, high contrast, premium. 1920×1080.

#### Esports Station — `public/images/zones/esports-station.webp`

> Cinematic photograph of a row of high-end esports gaming PCs, each with RGB-lit mechanical keyboards, large curved 240Hz monitors showing Valorant and Dota 2 gameplay. Dark gaming lounge with blue and purple accent lighting, premium high-back gaming chairs in black. Dolly shot down the row with slight motion blur on far monitors. Monitor-dominant lighting, cool palette with violet accents. Clean esports arena aesthetic, premium, 1920×1080.

#### Console Lounge — `public/images/zones/console-lounge.webp`

> Cinematic photograph of a boutique console gaming lounge: low leather lounge seating around a large 65-inch 4K OLED TV mounted on a dark wood paneled wall. Two players holding PS5 controllers playing a split-screen co-op game. Warm amber and green accent lighting, intimate dark room, dark wood tones. Wide shot from behind the players. Warm bulbs, orange and amber tones, screen glow. Boutique lounge photography, premium. 1920×1080.

#### Streaming Pod — `public/images/zones/streaming-pod.webp`

> Cinematic photograph of a single streamer inside a soundproofed broadcast-ready pod. Shure SM7B microphone on a boom arm, Elgato ring light illuminating the streamer, dual 27-inch monitors, Elgato Stream Deck visible. Dark compact booth with sound-dampening acoustic foam panels, pink and cyan RGB rim lighting behind. Three-quarter view from inside the pod looking at the streamer. Ring light on face, RGB rim lighting. Modern creator studio, premium, hyperreal. 1920×1080.

### 3.3 Three signature experience images (larger, feature-sized)

For the "Three rooms you will not find in a mall arcade" section — larger versions of the above with more dramatic framing.

**Files:** `public/images/experiences/{slug}.webp`

- `vr-arena-hero.webp` — vertical reframe of the VR Arena shot, player at full height, 4:5 portrait
- `flight-sim-hero.webp` — through-the-cockpit-window view with Mumbai skyline at dusk, 4:5
- `streaming-pod-hero.webp` — streamer live on camera, "LIVE" indicator visible on monitor, 4:5

Use the same prompt structure, swap aspect ratio and framing instruction.

### 3.4 Menu food photography (22 items)

Shoot every menu item against a dark moody background with cyan accent lighting — this ties the food photography back to the brand palette. Keep style consistent across all 22.

**File naming:** `public/images/menu/{slug}.webp` — square 1:1, 800×800.

**Universal prompt stem (prepend to each specific item):**

> Overhead or 45-degree photograph of {ITEM} on a matte dark slate surface with subtle cyan rim lighting. Minimal plating, no clutter, a single garnish only. Dark moody background with soft gradient. Premium food photography, hyperreal, shallow depth of field. No text, no watermarks. 1:1 square aspect ratio, 800×800.

**Specific items:**

- `chilli-paneer-poppers.webp` — "Six golden-brown cubes of paneer glazed in red chilli sauce, spring onion greens sprinkled over, served in a small black bowl."
- `chicken-65.webp` — "Red-orange chunks of fried chicken coated in curry leaf and chilli, lime wedge beside, served on a black plate."
- `masala-fries.webp` — "Hand-cut thick fries dusted in red chaat masala, lime wedge, served in a paper cone inside a dark bowl."
- `peri-peri-wings.webp` — "Six chicken wings with glossy red peri-peri sauce, small ramekin of blue cheese dip, scattered sesame."
- `papdi-chaat-cups.webp` — "Six small crisp papdi cups filled with yogurt, chutneys, pomegranate seeds and sev, arranged on a dark slate."
- `chicken-keema-pav.webp` — "Two Mumbai pav sliders with spiced minced chicken filling, buttered buns, lime wedge."
- `butter-chicken-naan.webp` — "Tomato-cream curry with pieces of chicken in a copper serving kadhai, butter naan half-folded beside, coriander leaves."
- `paneer-butter-masala.webp` — "Cubes of paneer in rich orange tomato gravy in a copper bowl, jeera rice on a small plate beside."
- `chicken-biryani.webp` — "Dum biryani in a copper handi with the lid half-open, boiled egg visible, garnished with fried onions and coriander, raita and salan in small bowls."
- `veg-hakka-noodles.webp` — "Wok-tossed noodles with vegetables in a dark bowl, chopsticks resting on the side."
- `dal-khichdi.webp` — "Yellow khichdi topped with a dollop of ghee in a brass bowl, roasted papad standing up, lime pickle and curd in tiny bowls."
- `grilled-chicken-sandwich.webp` — "Toasted sourdough sandwich cut in half showing grilled chicken, cheese, pesto, served on a wooden board with a few fries."
- `masala-chai.webp` — "A kulhad (clay cup) of hot masala chai with steam rising, biscuits beside, cinnamon stick."
- `cold-coffee.webp` — "Tall glass of cold coffee topped with a scoop of vanilla ice cream and cocoa dust, straw inserted."
- `mango-lassi.webp` — "Thick orange mango lassi in a tall glass with a saffron strand on top, served on a dark background."
- `fresh-lime-soda.webp` — "Clear fizzy lime soda in a tall glass with lime wheels and mint leaves, condensation on the glass."
- `blue-lagoon.webp` — "Vibrant blue mocktail in a tall glass with lime wheel on the rim, ice cubes, served on a dark bar."
- `virgin-mojito.webp` — "Virgin mojito in a highball glass with crushed ice, mint leaves, lime wheels, served on a dark bar surface."
- `gamers-combo.webp` — "Overhead flat lay: grilled chicken sandwich on wooden board, cone of fries, and a tall cold coffee, arranged on a dark slate."
- `match-day-platter.webp` — "Overhead flat lay of a sharing platter: wings, paneer poppers, papdi chaat cups, two cocktail glasses, arranged on a large dark board."
- `victory-meal.webp` — "Overhead flat lay: chicken biryani copper handi, a glass of mango lassi, and a small bowl of gulab jamun in syrup, arranged on dark slate."
- `streamers-fuel.webp` — "Overhead flat lay: masala fries in paper cone, a kulhad of chai, and a square brownie on a small plate, dark background."

### 3.5 Café ambient image for Menu hero

**File:** `public/images/menu/hero.webp`

> Cinematic photograph of the interior of a premium gaming café. A long bar counter with warm pendant lights overhead, baristas in dark aprons preparing coffee. In the background, soft blue gaming-zone lighting visible through a glass partition. The café is modern-industrial, dark wood, matte black fixtures, with hanging edison bulbs. Shallow depth of field, 16:9 aspect ratio, photorealistic, premium. 1920×1080.

---

## Phase 4 — Enhanced animations & effects

The baseline motion is already in place. Add the following layer of polish — but only where it serves the user:

### 4.1 Page transitions

Wrap the App Router with Framer Motion `AnimatePresence` in `src/app/template.tsx`. Each route transition: fade from 0 to 1 over 240ms, with a tiny y-rise (12px → 0). The grain overlay sits outside the AnimatePresence so it never flickers.

### 4.2 Hero scroll parallax

As the user scrolls past the hero, the orbital composition drifts up at 0.5× scroll speed. The headline stays put. Use `transform: translate3d(0, calc(var(--scroll) * -0.5px), 0)` wired via `requestAnimationFrame`, not scroll-event listeners (which thrash).

### 4.3 Zone card reveal choreography

When a user scrolls to the zones section, the six cards don't fade in uniformly. Stagger them in a specific order:
- Top-left → Top-middle → Top-right (0.08s stagger)
- Bottom-left → Bottom-middle → Bottom-right (0.08s stagger, 0.1s after top row completes)
- Each card: `opacity 0 → 1, translateY 20px → 0, scale 0.97 → 1`, duration 0.6s, ease-out
- Use `once: true` on the ScrollTrigger so re-scrolling doesn't retrigger

### 4.4 Image loading effect

Every real photo (zone images, menu items, experience hero) loads with a branded skeleton: cyan-to-magenta gradient shimmer at 2s duration, then the image fades in over 400ms. Use the `onLoad` event, not CSS alone, to time the fade.

### 4.5 Pricing tier reveal

When pricing section enters view, the four tiers slide up in sequence, 0.1s stagger. The Silver tier (highlighted) gets a secondary animation: its border pulses once in cyan after the slide completes. Use GSAP timeline.

### 4.6 Live counter ambient animation

The "Live now X players" number currently updates every 4s. Add a subtle "flip" animation when it changes: the old number rolls up out of view (translate -100%) and the new number rolls in from below (translate 0 from 100%). Use CSS keyframes, 200ms per transition.

### 4.7 Confirmation page celebration

When the booking confirmation page loads:
1. The headline "You're in." reveals with the clip-path word animation (reuse hero component)
2. The QR code SVG strokes draw themselves in using `stroke-dasharray` + GSAP (1.2s total)
3. Confetti bursts in cyan, magenta, violet, amber for 1.5 seconds (use `canvas-confetti` package, respect reduced-motion)
4. Timeline progress indicator ticks: Reserved (filled, pulsing) → En route (empty) → Checked in (empty)

### 4.8 Scroll progress indicator

A thin 2px cyan progress bar fixed to the very top of the viewport, filling left to right as the user scrolls through the page. Behind the grain, above everything else. On mobile, this becomes a small circular progress indicator in the bottom-right corner (optional).

### 4.9 Cursor trail on hero only

A single soft cyan dot (~12px, blur-xl) follows the cursor with lerp 0.15. Disabled on touch, disabled on reduced-motion. Keep it ONLY in the hero section — not site-wide (which would be exhausting).

### 4.10 Menu tab transition

When switching menu tabs (Snacks → Mains → Drinks → Combos), items in the previous tab fade+scale down and out, new items fade+scale up and in, with a 0.08s stagger within each tab. 240ms duration. Not a slide — a crossfade with movement.

### 4.11 Floating form labels (booking + membership forms)

Input labels float from inside the field to above-it on focus. 180ms ease-out. Label gets smaller (14px → 12px) and changes color to cyan. On blur-with-value, the label stays floated. On blur-empty, it drops back.

### 4.12 Button magnetic + ripple (expand existing)

Primary buttons already magnetic. Add a cyan ripple on click: expands from click point to fill the button, 400ms, then fades. Use CSS-only via a `::after` pseudo-element with `transform: scale()` on `:active`.

### 4.13 404 page: broken orbital composition

The 404 page uses a MODIFIED version of the hero orbital composition where the orbit rings are broken (dashed strokes, missing segments) and the core orb glitches between cyan and magenta. The six satellite orbs are scattered rather than orbiting. Headline: "This world doesn't exist yet." Keep it in-brand.

### 4.14 Scroll-driven text reveals on signature features

For each of the 3 signature experience blocks, the heading reveals character-by-character as it scrolls into view. Use GSAP ScrollTrigger with a `scrub: 0.5` so the user controls the reveal pace. Keep durations tight so it doesn't feel sluggish on fast scroll.

### 4.15 Mobile nav drawer

The current mobile menu probably uses shadcn Sheet. Upgrade: the Sheet slides in from the right with a backdrop blur (not just a dim), the nav links stagger-reveal (0.05s each), and the theme toggle sits at the bottom with the "Live now" pill above it.

---

## Phase 5 — Logo integration + brand lockup

Once the generated logo files exist:

1. Replace all inline `<svg class="logo__mark">` with `<Image src="/logo-mark.svg" />`
2. Use the lockup version in the navbar (desktop) and footer; mark-only in mobile nav
3. Favicon: generate 32×32, 16×16, 180×180 (Apple touch icon) variants
4. OG image for social sharing: `public/og-image.png` — 1200×630, the lockup logo over the hero orbital composition with the tagline "Enter another world."

---

## Hard rules (do not break any)

1. **Do not break the booking flow.** After every change, click through: landing → book → zone → date/time → details → confirm → see QR. If any step breaks, revert that specific change.
2. **Do not re-break the hero or Silver tier bugs.** Those are Phase 1. If a later change undoes them, you've regressed — stop and fix.
3. **Every real image you generate must have proper alt text.** Zone images get alt text matching the zone name + "zone at GameOn." Menu items get alt text matching the dish name.
4. **Respect `prefers-reduced-motion`** on every animation added. Confetti especially — disabled under reduced-motion.
5. **Image sizes must be optimized** — use `next/image` with explicit `width`, `height`, and `sizes`. No raw `<img>` tags for anything over 100×100.
6. **Test every page in both themes after image generation.** Dark images on dark backgrounds can disappear; apply a subtle warm overlay in light mode or a dark overlay in dark mode so edges don't get lost.
7. **Keep images under 200KB each** after WebP compression. If an image is bigger, re-generate with a tighter prompt or compress more aggressively.
8. **Do not add animation libraries beyond GSAP, Framer Motion, and canvas-confetti.** No Lottie, no Three.js, no particles.js. The current stack is enough.

---

## Execution plan (do in this order)

1. **Fix bugs** (Phase 1) — 15 min. Verify in both themes.
2. **Change tagline and site title** (Phase 2.1) — 10 min.
3. **Generate logo pack** (Phase 3.1) — 20 min. Integrate before moving on.
4. **Generate zone images** (Phase 3.2) — 30 min. Replace SVG placeholders.
5. **Generate signature experience images** (Phase 3.3) — 15 min.
6. **Replace menu content + generate food images** (Phase 2.2 + 3.4) — 60 min. The biggest content pass.
7. **Add page transitions and image loading effects** (Phase 4.1, 4.4) — 20 min.
8. **Add hero parallax, zone choreography, pricing reveal** (Phase 4.2, 4.3, 4.5) — 30 min.
9. **Add live counter flip, cursor trail, scroll progress** (Phase 4.6, 4.9, 4.8) — 25 min.
10. **Add confirmation celebration + 404 broken-orbit** (Phase 4.7, 4.13) — 30 min.
11. **Floating labels, button ripple, mobile nav** (Phase 4.11, 4.12, 4.15) — 25 min.
12. **Menu tab transitions + text reveals** (Phase 4.10, 4.14) — 15 min.
13. **Final pass**: Lighthouse, keyboard-only booking, mobile at 375px, reduced-motion.

Total: ~5 hours of focused work.

Pause and show screenshots after Phase 1 (bugs fixed), after Phase 6 (menu with real food images), and after Phase 10 (all animations added).

Begin with Phase 1.
