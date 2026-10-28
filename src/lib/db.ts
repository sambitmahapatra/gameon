import { DatabaseConfigurationError } from './db-errors';
import type { CreateBookingInput, BookingFilter } from './sqlite';
import type { Member } from './types';
export { SlotUnavailableError, DatabaseConfigurationError } from './db-errors';
export type { CreateBookingInput, BookingFilter, AdminStats, SiteStats } from './sqlite';
export type { Booking, BookingDetail, Slot, Zone } from './types';

export const usesPostgres = () => Boolean(process.env.DATABASE_URL);
export const databaseConfigured = () => usesPostgres() || !process.env.VERCEL;

async function driver() {
  if (usesPostgres()) return import('./postgres');
  if (process.env.VERCEL) throw new DatabaseConfigurationError();
  return import('./sqlite');
}
export async function getZones() {
  return (await driver()).getZones();
}
export async function getZone(id: string) {
  return (await driver()).getZone(id);
}
export async function getAvailableSlots(zoneId: string, date: string) {
  return (await driver()).getAvailableSlots(zoneId, date);
}
export async function getSlot(id: number) {
  return (await driver()).getSlot(id);
}
export async function createBooking(input: CreateBookingInput) {
  return (await driver()).createBooking(input);
}
export async function getBooking(id: string) {
  return (await driver()).getBooking(id);
}
export async function listBookings(filter: BookingFilter = {}) {
  return (await driver()).listBookings(filter);
}
export async function cancelBooking(id: string) {
  return (await driver()).cancelBooking(id);
}
export async function getAdminStats() {
  return (await driver()).getAdminStats();
}
export async function getSiteStats() {
  return (await driver()).getSiteStats();
}
export async function getLiveCount() {
  return (await driver()).getLiveCount();
}
export async function listEvents(category?: string) {
  return (await driver()).listEvents(category);
}
export async function registerForEvent(id: string) {
  return (await driver()).registerForEvent(id);
}
export async function createMember(input: {
  name: string;
  phone: string;
  tier: Member['tier'];
}) {
  return (await driver()).createMember(input);
}
