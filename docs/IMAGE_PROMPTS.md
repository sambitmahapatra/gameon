# Zone image prompts

Generate these externally (Leonardo.ai, Bing Image Creator, Ideogram), save each as
`public/images/zones/<zone-id>.jpg` at 16:9, then add the zone id to `WITH_ARTWORK` in
`src/lib/zone-images.ts`. Until a zone is listed there the UI shows an accent-tinted
gradient, so a missing file never renders a broken image.

Zone ids: `vr-arena`, `flight-sim`, `racing-cockpit`, `esports-station`,
`console-lounge`, `streaming-pod`.

Café photography uses free Unsplash stock in `public/images/menu/`: search
"nachos dark background", "burger moody", "mocktail neon", "fries closeup".

## Prompts

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
