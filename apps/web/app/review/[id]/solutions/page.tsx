import { SolutionsTab } from "@/components/review/solutions-tab";
import { getSolutions } from "@/lib/supabase/queries";

type Params = Promise<{ id: string }>;

export default async function SolutionsPage({ params }: { params: Params }) {
    const { id } = await params;
    const solutions = await getSolutions(id);

    return (
        <SolutionsTab
            prId={id}
            solutions={solutions}
        />
    );
}
