# REPORT — Meta Pages Candidate CV showcase (2026-10-07)

**SoT:** `D:\KarmaCodeMeta\master\client-websites\KshetraMap`  
**origin:** `karmacodemeta/kshetramap` @ `main`  
**Live Pages:** https://karmacodemeta.github.io/kshetramap/  
**Approach used:** **(1) Best** — Next static export of public fixture-only Candidate CV routes (not fallback HTML stubs).

## A) How / where dummy candidates work

### Full local app (Next + Mongo)

| Dummy | Open how | URL |
|-------|----------|-----|
| **Anant Kumar Singh** | Map `/ac/178` → click candidate **name** in booth popup / legend / map control / mobile sheet (`isAnantCandidate`) **or** Dashboard → "Anant Kumar Singh" | Public: `/candidates/demo-mokama-anant-kumar-singh` · Auth/owner edit: `/app/candidates/demo-mokama-anant-kumar-singh` (login) |
| **Rameshwar Prasad** | Dashboard → "Rameshwar Prasad (Demo 2)" (not map name-click) | Public: `/candidates/demo-mokama-rameshwar-prasad` · Auth: `/app/candidates/demo-mokama-rameshwar-prasad` |

Fixtures: `data/demo/candidate-cv-mokama-showcase.json` (Anant), `data/demo/candidate-cv-mokama-rameshwar-prasad.json`.  
Wiring: `src/lib/candidateCv/candidateLink.ts` (`ANANT_CANDIDATE_CV_HREF` → public `/candidates/...`).

### Meta GitHub Pages (static, no Mongo)

| Dummy | Pages URL |
|-------|-----------|
| Anant | https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-anant-kumar-singh/ |
| Rameshwar | https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-rameshwar-prasad/ |

**Click path on Pages:** open https://karmacodemeta.github.io/kshetramap/ac/178/ → click booth → click winner name **Anant Kumar Singh** (emerald underline) → public CV. Rameshwar: open URL above directly (no map name-click).

## B) What changed (build approach 1)

1. **Public static route** `src/app/candidates/[id]/page.tsx` with `generateStaticParams` for both demo IDs; `getCandidateCvFromFixture` (no Mongo/auth); `CandidateCvClient` with `isOwner={false}`.
2. **Map links** now use `/candidates/...` (still works locally; `/app/candidates/...` kept for owner edit under parked `src/app/app`).
3. **Fonts:** removed `next/font/google` from root layout (failed Noto Devanagari loader on this PC); CSS Google Fonts `<link>` + `globals.css` font CSS variables.
4. **`build:static`:** `npx next build --webpack`, soft `.next` wipe; still parks `api` / `login` / `app` / `dossier` (server-only). Public `candidates/` is **not** parked.
5. **Deploy:** `out/` force-pushed to Meta `gh-pages` (orphan). H3MRAJ Pages left retired.

## HTTP proofs (2026-10-07 02.58 IST)

| URL | Code |
|-----|------|
| https://karmacodemeta.github.io/kshetramap/ | **200** |
| https://karmacodemeta.github.io/kshetramap/ac/178/ | **200** |
| https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-anant-kumar-singh/ | **200** (body contains Anant Kumar Singh) |
| https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-rameshwar-prasad/ | **200** (body contains Rameshwar Prasad) |

Map Anant href proof: live chunk `_next/static/chunks/244.d4aa976f91de8a2a.js` contains `P="/candidates/demo-mokama-anant-kumar-singh"`; AC page chunk references `244` (Next `Link` + `basePath` → `/kshetramap/candidates/...`).

## SHAs

| Ref | SHA |
|-----|-----|
| `gh-pages` tip (deploy) | `ee188daf94d578c27eafd65c7b8a77ba50ca437e` |
| `main` (this feature commit) | `0bced05424c7788b476ee0dfce7b3d587e1b4395` |

## Constraints honored

- GITHUB_PAGES parking kept for login/api/app/dossier  
- Map + `/ac/178` preserved  
- No force to `main`; no secrets; H3MRAJ Pages not re-enabled  
- Push order: client → client-websites → master  