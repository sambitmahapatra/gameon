import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ₹1,200 — no decimals, Indian digit grouping. */
export function inr(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** '14:00' → '2:00 PM' */
export function prettyTime(time: string) {
  const [hRaw, m] = time.split(':');
  const h = Number(hRaw);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}

/** Date → 'YYYY-MM-DD' in local time (not UTC — slots are local to Powai). */
export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 'YYYY-MM-DD' → local Date at midnight. */
export function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/**
 * Base for client-side API calls. Empty on the website (same-origin), set to
 * the hosted origin for the static export the APK wraps.
 */
export const apiBase = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/$/, '');

export function api(path: string) {
  return `${apiBase}${path}`;
}
