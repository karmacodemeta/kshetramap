export const ANANT_CANDIDATE_ID = "demo-mokama-anant-kumar-singh";
/** Public showcase path (static Pages + local). Auth/owner edit stays under /app/candidates/... */
export const ANANT_CANDIDATE_CV_HREF = `/candidates/${ANANT_CANDIDATE_ID}`;
/** Authenticated app route (owner edit chrome); parked on GITHUB_PAGES static export. */
export const ANANT_CANDIDATE_CV_APP_HREF = `/app/candidates/${ANANT_CANDIDATE_ID}`;

export const RAMESHWAR_CANDIDATE_ID = "demo-mokama-rameshwar-prasad";
export const RAMESHWAR_CANDIDATE_CV_HREF = `/candidates/${RAMESHWAR_CANDIDATE_ID}`;
export const RAMESHWAR_CANDIDATE_CV_APP_HREF = `/app/candidates/${RAMESHWAR_CANDIDATE_ID}`;

/** Demo IDs baked into static export via generateStaticParams. */
export const DEMO_CANDIDATE_CV_IDS = [
  ANANT_CANDIDATE_ID,
  RAMESHWAR_CANDIDATE_ID,
] as const;

/**
 * Detects whether a candidate represents Anant Kumar Singh in AC-178 Mokama.
 * Matches candidate key ("anant_kumar_singh", "anant"), English name, or Hindi name.
 */
export function isAnantCandidate(
  key?: string | null,
  name?: string | null
): boolean {
  if (key) {
    const k = key.toLowerCase();
    if (k === "anant_kumar_singh" || k === "anant" || k.includes("anant")) {
      return true;
    }
  }
  if (name) {
    if (name.includes("Anant") || name.includes("अनंत")) {
      return true;
    }
  }
  return false;
}

/**
 * Returns public candidate CV URL if candidate is recognized, or null otherwise.
 */
export function getCandidateCvHref(
  key?: string | null,
  name?: string | null
): string | null {
  if (isAnantCandidate(key, name)) {
    return ANANT_CANDIDATE_CV_HREF;
  }
  return null;
}