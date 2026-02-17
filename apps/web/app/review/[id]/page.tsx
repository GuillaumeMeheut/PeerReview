import { notFound } from "next/navigation";
import { getPullRequest } from "@/lib/mock-data";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string }>;

export default async function ReviewPage({ params }: { params: Params }) {
    const { id } = await params;
    const pr = getPullRequest(id);

    if (!pr) {
        notFound();
    }

    return (
        <ReviewClient
            pr={pr}
        />
    );
}
