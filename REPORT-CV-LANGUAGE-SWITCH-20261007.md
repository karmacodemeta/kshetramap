# REPORT: Candidate CV LanguageSwitch (Meta Pages) — 2026-10-07 IST

## Goal
Restore Hindi (LanguageSwitch) on KshetraMap public Candidate CV pages; rebuild + redeploy Meta GH Pages.

## Tip before
- Client SoT `main`: `bbe40ae`

## Change
- **Mount:** `src/components/candidateCv/IdentityStrip.tsx` — `"use client"` + `<LanguageSwitch />` in right chrome (before Overview|Gazette).
- Covers both public `/candidates/[id]` and auth `/app/candidates/[id]` (same `CandidateCvClient` → `IdentityStrip`).
- Home / Map already had the switch (unchanged).
- **Test fix:** `BoothPopup.test.tsx` href `/app/candidates/...` → `/candidates/...` (stale vs Pages cutover).

## Leftover
- CV body copy still EN-only (hardcoded). Switch is chrome parity only; full `@/lib/i18n` CV pass deferred.

## Verify
- `npm test`: 19 files / 133 tests passed
- `npm run lint`: pre-existing errors elsewhere; none on IdentityStrip / LanguageSwitch
- `npm run build:static`: OK (routes include both demo CVs)
- `npm run deploy:gh`: Meta `gh-pages` `8399cef` (orphan force to Pages branch only)

## Live proof (curl)
| URL | Status |
|-----|--------|
| https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-anant-kumar-singh/ | 200 |
| https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-rameshwar-prasad/ | 200 |
| https://karmacodemeta.github.io/kshetramap/ | 200 |
| https://karmacodemeta.github.io/kshetramap/ac/178/ | 200 |

- CV page chunk `.../candidates/%5Bid%5D/page-6c0614b6e3a11574.js`: `setLocale`, `lang.label`, `lang.hi`
- Shared `335-adbfe51a68b79a10.js`: `hi:"हिं"`, `kshetramap-lang`, `"EN"`

## Push chain
- client (kshetramap) → client-websites → master (no force-push on source branches; no H3MRAJ Pages)
