import { Metadata } from "next";
import { SolutionsTab } from "@/components/review/solutions-tab";
import { getExercise, getSolutions, getUser } from "@/lib/supabase/queries";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const pr = await getExercise(id);
    if (!pr) return {};

    return {
        title: `Solutions — ${pr.title}`,
        description: `Community solutions for the "${pr.title}" code review exercise on PeerReview.`,
        alternates: { canonical: `${baseUrl}/review/${id}/solutions` },
        openGraph: {
            title: `Solutions — ${pr.title}`,
            description: `Community solutions for the "${pr.title}" code review exercise.`,
        },
    };
}

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
