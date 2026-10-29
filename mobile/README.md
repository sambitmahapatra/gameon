# GameOn offline app

An app focused on repeat visits, rather than a copy of the marketing website. The supplied Aangan APK uses a native WebView with one bundled HTML file and local storage; GameOn follows that approach with its own Android source, package, icon and signing key.

## Deliverables

- `GameON application/GameOn.apk` — signed Android package, approximately 700 KB.
- `GameON application/GameOn App.html` — the same standalone offline app, approximately 1.1 MB. Open directly in a modern browser. No server is required.
- Signature verification, manifest inspection and APK checksum reports are alongside the files.

The Android package is `com.gameon.offline`, labelled **GameOn**, targeting Android 15 / API 35 and supporting Android 6 / API 23 onward with a sufficiently recent Android System WebView. A physical device installation test is still recommended; command-line verification and DOM tests are not an emulator/device test.

## What the app does

- **Play:** browse seven experiences, view equipment descriptions and offline reference prices, save favourites.
- **Café:** search/filter the shared food menu, assemble a local shortlist and see the priced subtotal. Unknown prices remain unquoted.
- **My plans:** save/edit/remove preferred dates, times, crew sizes, durations and notes; optionally include a snapshot of the café list; estimate costs and share the idea with a crew.
- **Timer:** start, pause, resume and reset a session timer. End timestamps survive app restarts. There are no background alarms or notifications.
- **Club:** venue details, optional directions/call actions, read-only membership comparison, theme preferences and a confirmed local reset.

There is no login, live inventory, reservation confirmation, ordering, payment, admin area, analytics or backend. Plans are explicitly labelled **not booked**. Café lists are explicitly **not orders**. All app state is stored locally, separately from the website. It does not read `.env.local` or use Supabase.

## Build on this Windows workspace

The toolchain is already prepared under `.cache/android-tools`. To prepare a fresh checkout:

```powershell
npm ci
node scripts/setup-mobile-tools.mjs
npm run build:mobile
npm run build:apk
```

The portable dependencies are Android SDK Platform 35, Build Tools 35.0.0 and Eclipse Temurin JDK 17. Downloads and checksums are pinned in `mobile/toolchain.json`. These remain in the ignored workspace cache and do not change global Java/Android settings. Existing installations can be supplied with the PowerShell build script’s `-JdkHome`, `-AndroidJar` and `-BuildTools` parameters.

`scripts/build-mobile-html.ts` reads the existing website’s venue, menu and tier data, optimizes local images and embeds all images/fonts/scripts/styles. It generates a CSP with a hash for the actual bundled script and `connect-src 'none'`.

`scripts/build-mobile-apk.ps1` compiles Java to DEX, builds Android resources with AAPT2, packages the identical HTML, aligns the ZIP, signs the APK and verifies it with `apksigner`. It does not depend on Capacitor, Gradle or a hosted URL. The existing website’s Capacitor configuration is unchanged.

### Signing and updates

The APK uses a development signing key created at `.cache/mobile-signing/gameon-development.keystore` (alias `gameon-development`, standard development password `android`). This is suitable for a sideloaded prototype. Keep this ignored key if you want future prototypes to update the installed app; a different key requires uninstalling the old app, which erases its local data. Store distribution needs your own release signing process and increasing the version code.

## Tests

```powershell
npm install --prefix .cache/mobile-test-deps --no-save --ignore-scripts linkedom
npm run build:mobile
npm run test:mobile
```

Tests cover data validation, budget calculations, unknown prices, capacity, date and closing-time checks, timer behavior, navigation, favourites, café quantities, plans, escaping user notes, theme persistence, simulated restarts, sharing text and deletion. They verify the CSP hash and that all runtime images are embedded. Linkedom is test-only and never bundled in the APK.

The Android manifest requests **zero permissions**, including no Internet permission. The WebView blocks network loads and file/content access. It serves the single bundled HTML at the standard app-assets HTTPS origin using a restricted request interceptor. No JavaScript/native object bridge is exposed. Only user-initiated maps/dialler links and local plan sharing can open external Android apps.

Implementation references: [Android local content](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content), [AAPT2](https://developer.android.com/tools/aapt2), [APK signing](https://developer.android.com/tools/apksigner).

Photos come from the website’s local redesign assets. Barlow Condensed and DM Sans licenses are embedded in the standalone HTML; original license files remain in `public/fonts`.
