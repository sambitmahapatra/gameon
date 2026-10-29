import { withDb } from './bootstrap';
import { databaseConfigured, getZones, getSiteStats, listEvents } from './db';
import { ZONE_SEED } from './data/venue';
import type { GameEvent, Zone } from './types';
import { zoneName } from './data/club';

/** Reference content remains browsable while the hosted database is being set up.
 * Configured database failures still surface; they are never replaced with demo data.
 */
export async function getPublicZones(): Promise<Zone[]> {
  const zones = databaseConfigured()
    ? withDb(getZones)
    : ZONE_SEED.map((zone) => ({ ...zone, image: `/images/zones/${zone.id}.webp` }));
  return (await zones).map((zone) => ({ ...zone, name: zoneName(zone.id, zone.name) }));
}
export async function getPublicZone(id: string) {
  return (await getPublicZones()).find((zone) => zone.id === id);
}
export async function getPublicEvents(): Promise<GameEvent[]> {
  return databaseConfigured() ? withDb(listEvents) : [];
}
export async function getPublicStats() {
  return databaseConfigured()
    ? withDb(getSiteStats)
    : {
        zonesOpen: ZONE_SEED.length,
        tournamentsThisMonth: 0,
        members: 0,
        slotsFreeToday: 0,
      };
}
