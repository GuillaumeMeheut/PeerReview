import { notFound } from "next/navigation";
import { getExercise, getSolutionComments } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string; solutionId: string }>;

export default async function SolutionPage({ params }: { params: Params }) {
    const { solutionId, id } = await params;

    const [pr, comments] = await Promise.all([
        getExercise(id),
        getSolutionComments(solutionId),
    ]);

    if (!pr) {
        notFound();
    }

    return (
        <ReviewClient
            pr={pr}
            readOnly={true}
            initialComments={comments}
        />
    );
}
