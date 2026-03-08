import { Metadata } from "next";
import { DiscussionTab } from "@/components/review/discussion-tab";
import { getDiscussions, getExercise, getUser } from "@/lib/supabase/queries";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const pr = await getExercise(id);
    if (!pr) return {};

    return {
        title: `Discussions — ${pr.title}`,
        description: `Community discussions about the "${pr.title}" code review exercise on PeerReview.`,
        alternates: { canonical: `${baseUrl}/review/${id}/discussions` },
        openGraph: {
            title: `Discussions — ${pr.title}`,
            description: `Community discussions about the "${pr.title}" code review exercise.`,
        },
    };
}

export default async function DiscussionsPage({ params }: { params: Params }) {
    const { id } = await params;

    const [discussions, { user }] = await Promise.all([
        getDiscussions(id),
        getUser(),
    ]);



    const currentUser = user ? {
        name: user.user_metadata.full_name || user.user_metadata.user_name || "User",
        avatar: user.user_metadata.avatar_url || "",
    } : null;

    return <DiscussionTab exerciseId={id} initDiscussions={discussions} currentUser={currentUser} />;
}
