# REPORT — kshetramap-golden-r1r2-20261006

**Job:** Golden Rule R1 ping + R2 health stubs for KshetraMap  
**Branch:** `feat/kshetramap-golden-r1r2-20261006`  
**Push:** false  
**Date:** 2026-10-06 ~03:58 IST  
**Runner:** CoderBhai grok · grok-4.6  
**cwd:** `D:\KarmaCodeMeta\master\client-websites\KshetraMap`  
**Parent HEAD:** `09d4e01 feat(cv): add second dummy candidate (Rameshwar Prasad) and map link to Anant CV` on `feat/candidate-cv-showcase` (CV work kept).

## Outcome

Shipped KC Admin Contract **C1** and **C2** only:

| Rule | Endpoint | Auth |
|---|---|---|
| R1 / C1 | `GET /api/kc/ping` | public, in-memory IP rate limit (20 / 60s) |
| R2 / C2 | `GET /api/kc/health` | stub signature header `x-kc-admin-signature` vs env `KC_HEALTH_SECRET` |

Not built: R3 admin API, R4 debug login, KCS-Admin panel, Karma points, Candidate CV / map UI changes, ₹ amounts. Ports unchanged. Other processes not killed.

## Files

| Path | Role |
|---|---|
| `src/app/api/kc/ping/route.ts` | Public ping JSON `{ ok: true, t: <iso> }` |
| `src/app/api/kc/health/route.ts` | Signed health; 401 if header missing/invalid |
| `src/lib/kc-rate-limit.ts` | In-memory IP window + client IP helper; `resetPingRateLimiter()` for tests |
| `src/lib/kc-health.ts` | Timing-safe stub signature + cheap Mongo ping + backup unknown |
| `src/lib/kc-version.ts` | `version` from `package.json`; `commit` from `GIT_COMMIT` / `VERCEL_GIT_COMMIT_SHA` / `"unknown"`; `deployedAt` = process start ISO; `uptimeSec` |
| `src/app/api/kc/ping/route.test.ts` | 200 + shape; rate-limit 429 |
| `src/app/api/kc/health/route.test.ts` | 401 without/invalid sig; 200 with sig; body has no secret values |
| `.env.example` | Appended key **name** `KC_HEALTH_SECRET` (existing keys kept) |
| `RUNBOOK.md` | Ping/health URLs + `KC_HEALTH_SECRET` name |
| `README.md` | Env key name + `npm test` |

Health does **not** import `src/lib/db/mongo.ts` (that module defaults a localhost URI and caches a client). Mongo check: one-shot `MongoClient` with 2s server selection when `MONGODB_URI` is set; catch never logs URI/password; details are only `unconfigured` / `unreachable`.

## How to curl

Ping (public). Live against the already-running local app on 3001 (not started or killed by this job):

```powershell
curl.exe -sS http://localhost:3001/api/kc/ping
```

Observed: HTTP 200 `{"ok":true,"t":"2026-10-05T22:28:43.750Z"}`  
After 20 hits from the same IP inside 60s: HTTP 429 `{ "ok": false, "error": "rate_limited" }`.

Health (stub-signed). Put the value of `KC_HEALTH_SECRET` in `.env.local` (never paste the value into chat/REPORT). Restart `npm run dev` after adding it if the process started without the key.

```powershell
curl.exe -sS http://localhost:3001/api/kc/health
curl.exe -sS http://localhost:3001/api/kc/health -H "x-kc-admin-signature: wrong-signature"
curl.exe -sS http://localhost:3001/api/kc/health -H "x-kc-admin-signature: <KC_HEALTH_SECRET value>"
```

Observed without header / wrong value: HTTP 401 `{"error":"Unauthorized"}`.  
With a matching header: HTTP 200 body:

```json
{
  "status": "ok | degraded | down",
  "version": "0.1.0",
  "commit": "<sha or unknown>",
  "deployedAt": "<iso process start>",
  "uptimeSec": 0,
  "checks": {
    "mongodb": { "ok": true },
    "backup": { "ok": false, "detail": "unknown", "age": "unknown" }
  }
}
```

Status: `down` if Mongo is unconfigured or unreachable; `ok` if the cheap ping succeeds. Backup `unknown` does not force overall status (Rule 9 deferred). `degraded` is reserved for later extra checks.

## Env key names (no values)

| Key | Used for |
|---|---|
| `KC_HEALTH_SECRET` | Stub compare with header `x-kc-admin-signature` |
| `GIT_COMMIT` | Commit fallback (checked first) |
| `VERCEL_GIT_COMMIT_SHA` | Commit when deployed on Vercel |
| `MONGODB_URI` | Presence + ping only; never returned or logged |

Copy `KC_HEALTH_SECRET` into `.env.local` locally. Do not commit `.env.local`.

Signature is a **stub** (header equals secret, timing-safe). Full HMAC (method + path + timestamp + body hash) is not in this job.

## Tests

```
npm test     → vitest run
               Test Files  19 passed (19)
               Tests  132 passed (132)
               Duration  2.34s
               (includes 5 new: ping 200+429, health 401×2 + 200 scrub)
npx eslint src/app/api/kc src/lib/kc-rate-limit.ts src/lib/kc-health.ts src/lib/kc-version.ts
               exit 0 (new files clean)
npm run lint → exit 1, 45 pre-existing problems (34 errors, 11 warnings)
               none in the new kc ping/health files
npm run build → exit 0
               Next.js 16.2.10, routes include ƒ /api/kc/ping and ƒ /api/kc/health
```

TDD: tests written first; first run failed with missing `@/app/api/kc/{ping,health}/route`; implementation then 5/5 green.

Live curl (existing process on :3001, not started or killed by this job): ping 200; health 401 without/invalid signature.

## Commit

`feat/kshetramap-golden-r1r2-20261006` — `feat: add KC ping and signed health stubs (R1/R2)`  
Parent: `09d4e01 feat(cv): add second dummy candidate (Rameshwar Prasad) and map link to Anant CV`.  
Current HEAD after this job: run `git log -1 --oneline` on that branch (not pushed).

**Push: false.** Do not force-push.

## Blockers / notes

- Health is fail-closed: if `KC_HEALTH_SECRET` is unset, every health call is 401.
- Backup age always `"unknown"` until Rule 9.
- In-memory ping limiter is per Node process (resets on restart; not shared across workers). Fine for local PC.
- R11 light touch: version + commit are on the health payload. No app footer this job.
- Full-repo `npm run lint` was already red before this job; not fixed here.
- Did not read `/workspace/brains`.
- Did not add Karma points (Golden Rule: Karma never on KshetraMap).
- Did not revert Candidate CV work.
