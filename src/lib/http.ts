import { NextResponse } from 'next/server';

/** Demo data is live and mutable: never let a CDN or the router cache it. */
export const noStore = {
  'Cache-Control': 'no-store, max-age=0',
} as const;

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { ...init, headers: { ...noStore, ...init?.headers } });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status, headers: noStore });
}
