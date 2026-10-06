import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getCandidateCvFromFixture,
  toPlainCandidateCv,
} from "@/lib/candidateCv/candidateCvRepo";
import { DEMO_CANDIDATE_CV_IDS } from "@/lib/candidateCv/candidateLink";
import { CandidateCvClient } from "@/components/candidateCv/CandidateCvClient";

/**
 * Public Candidate CV showcase - statically exported for GitHub Pages.
 * Reads fixtures only (no Mongo, no auth). Owner edit remains under /app/candidates/[id].
 * Do not await searchParams here: that forces dynamic rendering and breaks output:export.
 * Client reads ?view=gazette via useSearchParams.
 */
export function generateStaticParams() {
  return DEMO_CANDIDATE_CV_IDS.map((id) => ({ id }));
}

export default async function PublicCandidateCvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cv = await getCandidateCvFromFixture(id);
  if (!cv) {
    notFound();
  }

  const initialCv = toPlainCandidateCv(cv);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B1220] p-8 text-[#F4EFE6]">
          Loading candidate portfolio...
        </div>
      }
    >
      <CandidateCvClient initialCv={initialCv} isOwner={false} />
    </Suspense>
  );
}