import { notFound } from "next/navigation";
import { getExercise, getSolutions } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string; solutionId: string }>;

export default async function SolutionPage({ params }: { params: Params }) {
    const { solutionId, id } = await params;

    const pr = await getExercise(id);
    const solutions = await getSolutions(id);
    const solution = solutions.find((s) => s.id === solutionId);

    if (!pr || !solution) {
        notFound();
    }

    // Merge solution comments into existing PR comments
    // In a real app we might want to distinguish them or fetch them separately in the client
    // For now we pass them as initialComments to the ReviewClient
    const solutionComments = solution.comments || [];

    return (
        <ReviewClient
            pr={pr}
            readOnly={true}
            initialComments={solutionComments}
        />
    );
}
