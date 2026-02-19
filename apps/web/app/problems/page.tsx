import { getExercises } from "@/lib/supabase/queries"
import { HomeContent } from "@/components/home-content"

//every 1 hour
export const revalidate = 3600

export default async function ProblemsPage() {
    const exercises = await getExercises()

    return (
        <HomeContent pullRequests={exercises} />
    )
}
