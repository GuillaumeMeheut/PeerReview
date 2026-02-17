import { DiscussionTab } from "@/components/review/discussion-tab";
import { getPRDiscussions } from "@/lib/mock-data";
import { notFound } from "next/navigation";
type Params = Promise<{ id: string }>;

export default async function DiscussionsPage({ params }: { params: Params }) {
    const { id } = await params;

    const data = getPRDiscussions(id);

    if (!data) {
        notFound();
    }

    return <DiscussionTab initDiscussions={data} />;
}
