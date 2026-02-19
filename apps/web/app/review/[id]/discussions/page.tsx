import { DiscussionTab } from "@/components/review/discussion-tab";
import { getDiscussions, getUser } from "@/lib/supabase/queries";

type Params = Promise<{ id: string }>;

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
