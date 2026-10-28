import type { Zone } from './types';

/**
 * Photography comes from Unsplash's CDN: no key, no account, just a photo id.
 * Dropping a local file into /public/images/zones and listing its zone id in
 * LOCAL_ARTWORK overrides the remote photo, which is how the generated artwork
 * from docs/IMAGE_PROMPTS.md takes over later.
 *
 * Every image sits on top of an accent-tinted gradient mesh, so a slow or
 * blocked CDN degrades to a rich background rather than a blank box.
 */
const UNSPLASH = 'https://images.unsplash.com/photo-';

/** Zone card and zone page artwork. */
const ZONE_PHOTOS: Record<string, string> = {
  'vr-arena': '1626379953822-baec19c3accd',
  'flight-sim': '1540962351504-03099e0a754b',
  'racing-cockpit': '1511994714008-b6d68a8b32a2',
  'esports-station': '1542751371-adc38448a05e',
  'console-lounge': '1486572788966-cfd3df1f5b42',
  'streaming-pod': '1598550476439-6847785fcea6',
};

/** Larger, more cinematic frames for the signature experience sections. */
const SIGNATURE_PHOTOS: Record<string, string> = {
  'vr-arena': '1593508512255-86ab42a8e620',
  'flight-sim': '1583394293214-28ded15ee5c6',
  'streaming-pod': '1623934199716-dc1308d87cea',
};

const HERO_PHOTO = '1550745165-9bc0b252726f';

/** Zone ids whose own artwork exists in /public/images/zones. */
const LOCAL_ARTWORK = new Set<string>([]);

function unsplash(id: string, width: number) {
  return `${UNSPLASH}${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export function zoneImage(zone: Pick<Zone, 'id' | 'image'>, width = 1200): string | null {
  if (LOCAL_ARTWORK.has(zone.id)) return zone.image ?? `/images/zones/${zone.id}.jpg`;
  const photo = ZONE_PHOTOS[zone.id];
  return photo ? unsplash(photo, width) : null;
}

export function signatureImage(zoneId: string, width = 1600): string | null {
  const photo = SIGNATURE_PHOTOS[zoneId];
  return photo ? unsplash(photo, width) : zoneImage({ id: zoneId, image: null }, width);
}

export function heroImage(width = 2400): string {
  return unsplash(HERO_PHOTO, width);
}

/**
 * A 12×8 blurred SVG, shared by every image. Precomputed rather than built with
 * Buffer, because this module is imported by client components too, and the
 * gradient beneath each image already carries the zone's own colour.
 */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMicgaGVpZ2h0PSc4Jz48ZmlsdGVyIGlkPSdiJz48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSczJy8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9JzEyJyBoZWlnaHQ9JzgnIGZpbGw9JyMxQzI1NDEnIGZpbHRlcj0ndXJsKCNiKScvPjwvc3ZnPg==';
