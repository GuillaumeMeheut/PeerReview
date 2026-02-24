import { notFound } from "next/navigation";
import { getExercise } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string }>;

export default async function ReviewPage({ params }: { params: Params }) {
    const { id } = await params;
    const pr = await getExercise(id);

    if (!pr) {
        notFound();
    }



    return (
        <ReviewClient
            pr={pr}
        />
    );
}
