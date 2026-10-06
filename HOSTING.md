# KshetraMap hosting

**Canonical product SoT (disk):** `D:\KarmaCodeMeta\master\client-websites\KshetraMap`  
**Canonical remote:** https://github.com/karmacodemeta/kshetramap (origin only)  
**Live GitHub Pages:** https://karmacodemeta.github.io/kshetramap/

## Layout

- Nested git repo / submodule under `karmacodemeta/client-websites` (`.gitmodules` path `KshetraMap` → `karmacodemeta/kshetramap.git`).
- One product = one remote = one disk path. Do **not** treat `H3MRAJ/kshetramap` as SoT or Pages home.

## Static Pages build

- Scripts: `npm run build:static` (`scripts/build-static.ps1`) then `npm run deploy:gh` (`scripts/deploy-gh-pages.ps1`).
- Parks server-only trees (`api`, `login`, `app`, `ac/[acNo]/dossier`) before `GITHUB_PAGES=1` export; Candidate CV lives under `app`/`api` so it is excluded from static Pages.
- Deploy defaults: `GH_REPO=karmacodemeta/kshetramap`, `GH_PAGES_BASE=kshetramap`, publishes orphan `gh-pages`.

## 2026-10-07 cutover notes

- Meta `main` advanced `7911dc5` → `0aea21d` (fast-forward merge of golden R1/R2 + CV tip `806156f`). No force-push to `main`.
- Fresh `next build` on this PC hit Turbopack `next/font/google` errors (and webpack then failed on stale `.next/dev` types). Pages went live by **mirroring the known-good H3MRAJ `gh-pages` commit `b072277`** to Meta `gh-pages`.
- Repo visibility set **public** so user Pages works.
- H3MRAJ Pages retired: default branch → `main`, `gh-pages` branch deleted; old URL returns 404. H3MRAJ README points here. Repo kept (history).

## Leftovers for Hemraj QA

- Worktree `D:\KarmaCodeMeta\master\wt\cv-showcase` still present @ `806156f` (ancestor of Meta `main`) — do not delete until confirmed redundant.
- Untracked local junk in SoT: `dev-3001.log`, `run-3001.cmd`, `jobs/.../BRIEF.md` etc. (not pushed).

## 2026-10-07 Candidate CV on Pages

- Public demo CVs export at `/candidates/[id]/` (fixtures only). `src/app/app` (auth dashboard + owner CV) stays parked for static builds.
- `npm run build:static` → parks server trees, soft-clears `.next`, runs `npx next build --webpack` with `GITHUB_PAGES=1`, restores parks.
- Fonts: root layout uses Google Fonts CSS `<link>` (not `next/font/google`) so static export succeeds on this PC.
- `npm run deploy:gh` publishes `out/` to Meta `gh-pages` (`karmacodemeta/kshetramap`).
- Live showcase:
  - https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-anant-kumar-singh/
  - https://karmacodemeta.github.io/kshetramap/candidates/demo-mokama-rameshwar-prasad/
- LanguageSwitch (EN/हिं) mounted on Candidate CV masthead (`IdentityStrip`); home/map unchanged.
- Map Anant name-click → public `/candidates/...` path (see `candidateLink.ts`).