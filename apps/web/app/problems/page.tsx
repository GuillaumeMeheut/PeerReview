import { getExercises } from "@/lib/supabase/queries"
import { HomeContent } from "@/components/home-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse PRs",
    description: "Browse realistic pull requests to practice your code review skills.",
};

//every 1 hour
export const revalidate = 3600

export default async function ProblemsPage() {
    const exercises = await getExercises()

    return (
        <HomeContent pullRequests={exercises} />
    )
}
