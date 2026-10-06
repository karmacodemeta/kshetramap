# KshetraMap Meta SoT + Pages cutover REPORT

**Date:** 2026-10-07 (Asia/Calcutta)  
**Machine:** H3MRAJ desktop `0e00d194-618d-4d0d-8239-674e6ea3ce8e` (D:/E: only)

## Success criteria

| Criterion | Result |
|-----------|--------|
| One disk SoT `client-websites\KshetraMap` | YES (already nested submodule; origin Meta) |
| origin = karmacodemeta/kshetramap; HEAD includes 806156f | YES — HEAD `0aea21d` (ancestor check OK) |
| Meta Pages LIVE | YES — https://karmacodemeta.github.io/kshetramap/ **HTTP 200** (title KshetraMap); `/ac/178/` 200 |
| H3MRAJ Pages dead | YES — https://h3mraj.github.io/kshetramap/ **HTTP 404**; Pages API 404 |
| REPORT written | this file |

## Disk / git

- **Path:** `D:\KarmaCodeMeta\master\client-websites\KshetraMap`
- **remotes:** `origin https://github.com/karmacodemeta/kshetramap.git` (h3mraj remote **removed**)
- **HEAD:** `0aea21d6dba6f62b674429a5343a742a092a81a2` — merge of golden R1/R2 + CV tip 806156f
- **Parent:** `client-websites` submodule pointer updated to `0aea21d` and pushed to `karmacodemeta/client-websites`

## Remotes / commits

- Meta `main`: was `7911dc5` only → normal push `7911dc5..0aea21d` (no force)
- Meta `gh-pages`: `b072277` (mirrored from former H3MRAJ known-good static deploy)
- Meta visibility: private → **public** (required for free-user Pages)
- Auth used for Meta work: `gh` as **karmacodemeta**; H3MRAJ account used only to retire H3MRAJ Pages/README

## H3MRAJ

- Pages: cannot DELETE via API while `gh-pages` was default; fixed by setting default_branch=`main`, then deleting `gh-pages` ref → Pages site gone (404)
- README on `main` updated to point to Meta SoT + Pages URL
- Repo **not** deleted (unique history retained)

## Build blocker (documented)

- `npm run build:static` failed here: Next 16.2.10 Turbopack + `next/font/google` (Noto Sans Devanagari). Webpack compile OK then typecheck failed on `.next/dev/types/validator.ts` missing `routes.js`.
- Mitigation used: reuse known-good static `gh-pages` `b072277` per cutover instructions.

## Leftovers

- `D:\KarmaCodeMeta\master\wt\cv-showcase` still exists (worktree @ 806156f) — leave for Hemraj QA
- `D:\KarmaCode\KshetraMap` exists but **no .git** (not SoT)
- Untracked files in SoT working tree (logs/job drafts) not committed

## Verify commands (outcomes)

- Meta Pages GET `/` → 200, title KshetraMap
- Meta Pages GET `/ac/178/` → 200
- H3MRAJ Pages GET `/` → 404
- `git -C ...\KshetraMap remote -v` → origin Meta only
- `git -C ...\KshetraMap merge-base --is-ancestor 806156f HEAD` → exit 0
