import { notFound } from "next/navigation";
import { getExercise, getLatestUserReview } from "@/lib/supabase/queries";
import { ReviewLayout } from "@/components/review/review-layout";

type Params = Promise<{ id: string }>;

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) {
    const { id } = await params;

    // Fetch both in parallel
    const [pr, latestReviewId] = await Promise.all([
        getExercise(id),
        getLatestUserReview(id)
    ]);

    if (!pr) {
        notFound();
    }

    return <ReviewLayout pr={pr} latestReviewId={latestReviewId}>{children}</ReviewLayout>;
}
