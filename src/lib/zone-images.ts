import type { Zone } from './types';

/**
 * Zones whose photo actually exists in /public/images/zones.
 *
 * Generate the artwork with the prompts in docs/IMAGE_PROMPTS.md, drop the file
 * in as <zone-id>.jpg, then add the id here — the gradient placeholder is
 * replaced on the next render. Keeping it a manifest avoids broken <img> tags
 * for zones that have no photo yet.
 */
const WITH_ARTWORK = new Set<string>([]);

export function zoneImage(zone: Pick<Zone, 'id' | 'image'>): string | null {
  return WITH_ARTWORK.has(zone.id) ? (zone.image ?? `/images/zones/${zone.id}.jpg`) : null;
}
