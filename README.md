# Daily Streaks

A calm, private habit tracker for Android. Streaks, history and four themes. No account, no ads, no tracking.

**Website and download:** https://daily-streaks.vercel.app/

## What's here
| Folder | What it is |
|---|---|
| `docs/` | The website (deployed on Vercel via `vercel.json`; also works with GitHub Pages from `/docs`): landing page, privacy policy (`privacy.html`) and the Android app (`DailyStreaks-1.3.0.apk`) |
| `android/` | Android app source. See [android/README.md](android/README.md) to build it |
| `web-app/` | The app's screens (one HTML file). The Android build bundles these into the APK |
| `site-src/` | Source of the website (React + Motion + Lenis). `npm install && npm run build` writes the site into `docs/` |

## App at a glance
- Android 8.0 or newer, about 450 KB
- Only permission: vibrate. No internet access, so habits never leave the phone.
- Excel export and copy/restore backup

APK SHA-256: `6ac28884941074cbeccdc6b41493749f134ce781648a1d62d9e26b7c3edbcdaa`
