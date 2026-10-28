# Phase 5 — Android APK

The repo is ready for this; nothing here has been run, because it needs Android Studio.

## Which approach to use

**Hosted WebView (recommended).** `capacitor.config.ts` keeps `server.url` pointed at the
deployed site. The APK is a themed shell over the live Next.js app, so API routes, the
database and freshly created confirmation pages all work. This is what the spec's risk
table concludes, and it is why `better-sqlite3` being a native module does not matter: the
database lives on the server, never inside the APK.

**Bundled export.** Comment out `server.url` and the contents of `./out` ship inside the
APK. First paint is faster and the shell works offline, but any route generated after the
export — a new booking's confirmation page — is not in the bundle, so set
`NEXT_PUBLIC_API_BASE` and expect the confirmation screen to be fetched, not prerendered.

## Steps

```bash
# 1. Deploy the website first (the APK points at it)
#    Vercel: import the repo, no config needed. Set ADMIN_KEY and
#    NEXT_PUBLIC_SITE_URL in the project's environment variables.

# 2. Install Capacitor
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npm install @capacitor/status-bar @capacitor/haptics @capacitor/push-notifications

# 3. Build the web output
NEXT_PUBLIC_API_BASE=https://<your-deployment> npm run build:static

# 4. Add the Android platform (capacitor.config.ts is already in the repo)
npx cap add android
npx cap sync

# 5. Open in Android Studio
npx cap open android
```

In Android Studio: **Build → Generate Signed Bundle / APK → APK**, create a keystore, build
the release APK.

## Notes

- **Keep the keystore out of the repo.** `.gitignore` already blocks `*.keystore`, `*.jks`
  and `keystore.properties`. A leaked keystore cannot be rotated for a published app.
- `data/gameon.db` is a server file. It is not packaged, and it must not be.
- Fonts come from Google Fonts at build time through `next/font`, which self-hosts them in
  `_next/static`, so they work offline in the WebView. Nothing extra to do.
- GSAP core and ScrollTrigger are free for commercial use. No paid plugins are used —
  SplitText was deliberately avoided (see the deviations table in ARCHITECTURE.md).
- `npx cap sync` after every `build:static`, or the APK keeps the previous bundle.
- `android/` is gitignored: it is generated, and regenerating it is one command.
