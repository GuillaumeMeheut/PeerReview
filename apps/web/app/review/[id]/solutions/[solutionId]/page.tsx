import { notFound } from "next/navigation";
import { getExercise } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string; solutionId: string }>;

export default async function SolutionPage({ params }: { params: Params }) {
    const { solutionId, id } = await params;

    // TODO: Fetch solution comments from Supabase once solution queries are implemented
    const solutionComments: never[] = [];
    const pr = await getExercise(id);

    if (!pr) {
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
