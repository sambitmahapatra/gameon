/**
 * Phase 5 config, used once Capacitor is installed:
 *   npm i -D @capacitor/cli && npm i @capacitor/core @capacitor/android
 *   npm run build:static && npx cap add android && npx cap sync
 *
 * Two ways to ship, both covered here:
 *
 *  1. Hosted (recommended, and what the spec's risk table calls for) — leave
 *     `server.url` set to the deployed site. The APK is a themed WebView over
 *     the live Next.js app, so bookings, the API routes and the SQLite
 *     database all keep working.
 *
 *  2. Bundled — comment out `server.url`. The exported ./out ships inside the
 *     APK and NEXT_PUBLIC_API_BASE points at the hosted backend. Faster first
 *     paint, but routes generated after the export (a fresh booking's
 *     confirmation page) are not in the bundle.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gameon.app',
  appName: 'GameOn',
  webDir: 'out',
  android: {
    backgroundColor: '#0A0E17',
  },
  server: {
    androidScheme: 'https',
    // Point this at the deployed site to keep the API routes working.
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gameon.vercel.app',
    cleartext: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0E17',
      overlaysWebView: false,
    },
    SplashScreen: {
      backgroundColor: '#0A0E17',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
