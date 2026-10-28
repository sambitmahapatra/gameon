/**
 * The website renders on demand so bookings and slot counts are always live.
 * The static export (npm run build:static, for the Capacitor APK) has no server
 * to render on, so the same pages are prerendered at build time instead and the
 * live data arrives from the hosted backend over fetch.
 *
 * Pages re-export `dynamic` from here:
 *   export { dynamic } from '@/lib/render-mode';
 */
export const isStaticExport = process.env.NEXT_OUTPUT === 'export';

export const dynamic = isStaticExport ? 'force-static' : 'force-dynamic';
