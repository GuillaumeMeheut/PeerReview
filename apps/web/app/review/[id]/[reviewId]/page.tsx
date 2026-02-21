import { notFound } from "next/navigation";
import { getExercise, getReviewComments } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string; reviewId: string }>;

export default async function ReviewPage({ params }: { params: Params }) {
    const { reviewId, id } = await params;

    const [pr, comments] = await Promise.all([
        getExercise(id),
        getReviewComments(reviewId),
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
