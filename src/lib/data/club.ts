/** Redesign labels keep the existing inventory IDs and database prices. */
export const ZONE_LOOK: Record<
  string,
  { name: string; image: string; description: string; tags: string[] }
> = {
  'console-lounge': {
    name: 'Console Lounge',
    image: 'console',
    description: 'PS5, Xbox and couch co-op. Bring your squad; settle the score.',
    tags: ['Multiplayer', 'Squad sessions'],
  },
  'vr-arena': {
    name: 'VR Arena',
    image: 'immersion',
    description:
      'Leave the room behind and step into immersive worlds with guided sessions.',
    tags: ['Immersive', 'Group play'],
  },
  'racing-cockpit': {
    name: 'Racing Rigs',
    image: 'racing',
    description: 'Grip the wheel, hit the apex and chase a leaderboard-worthy lap.',
    tags: ['Sim racing', 'Leaderboards'],
  },
  'flight-sim': {
    name: 'Flight Deck',
    image: 'flight',
    description:
      'Take the controls, learn the basics and see the world from the captain’s seat.',
    tags: ['Flight simulation', 'Guided play'],
  },
  'esports-station': {
    name: 'Competitive Arena',
    image: 'hero',
    description:
      'High-performance gaming for ranked grinds, friendly rivalries and tournament nights.',
    tags: ['Esports', 'Competition'],
  },
};
export function zoneName(id: string, fallback: string) {
  return ZONE_LOOK[id]?.name ?? fallback;
}
export const FEATURED_FOOD = [
  {
    name: 'The post-game burger',
    image: 'burger',
    description: 'A proper, satisfying refuel after a close match.',
    category: 'mains',
  },
  {
    name: 'Squad-size sides',
    image: 'sides',
    description: 'Shareable bites for the whole party.',
    category: 'snacks',
  },
  {
    name: 'The co-op combo',
    image: 'pizza',
    description: 'Easy crowd-pleasers made for multiplayer nights.',
    category: 'combos',
  },
  {
    name: 'Cool-down drinks',
    image: 'cooler',
    description: 'Mocktails, coolers and café favourites.',
    category: 'drinks',
  },
] as const;
