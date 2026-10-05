import fs from "fs";
import path from "path";

const PROCESS_STARTED_AT = new Date();
let cachedVersion: string | undefined;

export function getPackageVersion(): string {
  if (cachedVersion) return cachedVersion;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8");
    const pkg = JSON.parse(raw) as { version?: string };
    cachedVersion =
      typeof pkg.version === "string" && pkg.version ? pkg.version : "0.1.0";
  } catch {
    cachedVersion = "0.1.0";
  }
  return cachedVersion;
}

export function getRuntimeInfo(): {
  version: string;
  commit: string;
  deployedAt: string;
  uptimeSec: number;
} {
  const commitRaw =
    process.env.GIT_COMMIT?.trim() ||
    process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
    "";
  return {
    version: getPackageVersion(),
    commit: commitRaw ? commitRaw.slice(0, 40) : "unknown",
    deployedAt: PROCESS_STARTED_AT.toISOString(),
    uptimeSec: Math.floor(process.uptime()),
  };
}
