import { getFeedback } from "@/lib/mock-data";
import { FeedbackTab } from "@/components/review/feedback-tab";
import { AIFeedback } from "@/components/review/ai-feedback";
import { notFound } from "next/navigation";
import type { InlineComment } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function FeedbackPage({ params }: { params: Params }) {
    const { id } = await params;

    //Imagine getting submission and comments after submitting from the API (probably not if just being submitted)
    const comments: InlineComment[] = []

    const feedback = getFeedback(id);

    //TO implement
    // const AIFeedback = getAIFeedback(id);

    if (!feedback) {
        return <p>You should submit a solution first</p>
    }

    // TODO: Feedback logic needs to be updated to rely on submission state or always show?
    // For now showing the static feedback from mock data
    return (
        <div className="space-y-8">
            <AIFeedback prId={id} />
            <FeedbackTab feedback={feedback} />
        </div>
    );
}
