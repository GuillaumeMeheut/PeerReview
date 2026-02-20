import { getUser, getAIFeedbackForReview } from "@/lib/supabase/queries";
import { AIFeedback } from "@/components/review/ai-feedback";
import { SubmissionHistory } from "@/components/review/submission-history";

type Params = Promise<{ id: string, reviewId: string }>;

export default async function FeedbackAIPage({ params }: { params: Params }) {
    const { id, reviewId } = await params;

    const { user } = await getUser();
    const initialFeedback = await getAIFeedbackForReview(reviewId);

    return (
        <div className="space-y-8">
            <SubmissionHistory exerciseId={id} currentReviewId={reviewId} />
            <AIFeedback prId={id} reviewId={reviewId} isLoggedIn={!!user} initialFeedback={initialFeedback} />
        </div>
    );
}
