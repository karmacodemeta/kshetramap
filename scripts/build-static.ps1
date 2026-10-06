# Build the GitHub Pages static export without touching git (no push).
# Parks every server-only route/page directory, runs `next build --webpack` with
# GITHUB_PAGES=1, then restores the parked directories no matter what.
# This is the real acceptance-test command for "the static build still passes" -
# a bare `GITHUB_PAGES=1 npm run build` fails even on pre-existing Module-1
# routes (api/acs, api/ac/[acNo]/booth-position lack static-export config),
# so this script's park step is required, not optional.
#
# 2026-10-07: use --webpack (not Turbopack) and wipe .next before build so
# next/font/google + stale .next/dev types do not fail the Pages export.
# Public Candidate CV showcase lives at src/app/candidates/[id] (NOT under
# parked src/app/app) so fixtures export without Mongo/auth.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$ParkList = @(
  @{ Path = "src\app\api";   Bak = "src\app\_api_static_bak" },
  @{ Path = "src\app\login"; Bak = "src\app\_login_static_bak" },
  @{ Path = "src\app\app";   Bak = "src\app\_app_static_bak" },
  # Module 2 dossier lives inside the Module-1 static tree (ac/[acNo]/...) so
  # it can share AcWorkspaceNav and the /ac/178/dossier URL shape - but it's
  # session-gated (auth()) and can't be statically exported like its map/history
  # siblings, which each define their own generateStaticParams(). Park only this
  # subdirectory, never the parent ac/[acNo] tree (map/history/place must stay static).
  @{ Path = "src\app\ac\[acNo]\dossier"; Bak = "src\app\ac\[acNo]\_dossier_static_bak" }
)

foreach ($p in $ParkList) {
  # -LiteralPath everywhere below (Test-Path/Move-Item/Remove-Item): the
  # dossier entry's path contains `[acNo]`, and PowerShell's default
  # wildcard-matching Path parameter treats `[...]` as a character class,
  # not a literal directory name - plain `Test-Path $p.Path` silently
  # returns $false for it (matching nothing), which would make this whole
  # park/restore cycle silently no-op for that entry. Confirmed by task-7's
  # `build:static` run: this bug was latent (never exercised) until this
  # task actually created `src\app\ac\[acNo]\dossier`, the first real
  # directory at that path since the ParkList entry was added.
  if ((Test-Path -LiteralPath $p.Bak) -and -not (Test-Path -LiteralPath $p.Path)) {
    # Stale backup from an interrupted prior run (Ctrl-C/crash between park
    # and restore) - restore it rather than deleting it, so we never destroy
    # a live source directory that never got parked back.
    Write-Host "    found stale backup $($p.Bak) with no live $($p.Path) - restoring it..."
    Move-Item -LiteralPath $p.Bak -Destination $p.Path
  }
}

$env:GITHUB_PAGES = "1"
if ($env:GH_PAGES_BASE) { } else { $env:GH_PAGES_BASE = "kshetramap" }

try {
  foreach ($p in $ParkList) {
    if (Test-Path -LiteralPath $p.Bak) { Remove-Item -LiteralPath $p.Bak -Recurse -Force }
    if (Test-Path -LiteralPath $p.Path) {
      Write-Host "    parking $($p.Path) for static build..."
      Move-Item -LiteralPath $p.Path -Destination $p.Bak
    }
  }

  if (Test-Path ".next") {
    Write-Host "    removing .next (avoid stale .next/dev types)..."
    $wipe = ".next_wipe_$([guid]::NewGuid().ToString('N').Substring(0,8))"
    try {
      Move-Item -LiteralPath ".next" -Destination $wipe -Force -ErrorAction Stop
      Remove-Item -Recurse -Force $wipe -ErrorAction SilentlyContinue
      if (Test-Path $wipe) { cmd /c "rmdir /s /q `"$wipe`"" | Out-Null }
    } catch {
      Write-Host "    warn: could not fully clear .next ($($_.Exception.Message)) - continuing"
    }
    if (Test-Path ".next") {
      Write-Host "    warn: .next still present; build will reuse what it can"
    }
  }

  Write-Host "    npx next build --webpack (GITHUB_PAGES=1)..."
  npx next build --webpack
  if ($LASTEXITCODE -ne 0) { throw "build failed" }
  if (-not (Test-Path "out")) { throw "out/ missing after build" }
  Write-Host "OK - static export built to out/"
} finally {
  foreach ($p in $ParkList) {
    if (Test-Path -LiteralPath $p.Bak) {
      if (Test-Path -LiteralPath $p.Path) { Remove-Item -LiteralPath $p.Path -Recurse -Force }
      Move-Item -LiteralPath $p.Bak -Destination $p.Path
      Write-Host "    restored $($p.Path)"
    }
  }
  Remove-Item Env:GITHUB_PAGES -ErrorAction SilentlyContinue
}