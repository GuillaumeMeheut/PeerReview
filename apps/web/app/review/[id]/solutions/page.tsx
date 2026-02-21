import { SolutionsTab } from "@/components/review/solutions-tab";
import { getSolutions, getUser } from "@/lib/supabase/queries";

type Params = Promise<{ id: string }>;

export default async function SolutionsPage({ params }: { params: Params }) {
    const { id } = await params;
    const [solutions, { user }] = await Promise.all([
        getSolutions(id),
        getUser()
    ]);

    const currentUser = user ? {
        name: user.user_metadata.full_name || user.user_metadata.user_name || "User",
        avatar: user.user_metadata.avatar_url || "",
    } : null;

    return (
        <SolutionsTab
            prId={id}
            initSolutions={solutions}
            currentUser={currentUser}
        />
    );
}
