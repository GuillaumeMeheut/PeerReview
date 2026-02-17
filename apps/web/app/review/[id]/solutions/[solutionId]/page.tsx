import { notFound } from "next/navigation";
import { getSolutionComments, getPullRequest } from "@/lib/mock-data";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string; solutionId: string }>;

export default async function SolutionPage({ params }: { params: Params }) {
    const { solutionId, id } = await params;

    const solutionComments = getSolutionComments(solutionId);
    const pr = getPullRequest(id);

    if (!solutionComments || !pr) {
        notFound();
    }

    return (
        <ReviewClient
            pr={pr}
            readOnly={true}
            initialComments={solutionComments}
        />
    );
}
