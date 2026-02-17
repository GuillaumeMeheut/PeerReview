import { getPullRequest } from "@/lib/mock-data";
import { FeedbackTab } from "@/components/review/feedback-tab";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function FeedbackPage({ params }: { params: Params }) {
    const { id } = await params;
    const pr = getPullRequest(id);

    if (!pr) {
        notFound();
    }

    // TODO: Feedback logic needs to be updated to rely on submission state or always show?
    // For now showing the static feedback from mock data
    return <FeedbackTab feedback={pr.feedback} />;
}
