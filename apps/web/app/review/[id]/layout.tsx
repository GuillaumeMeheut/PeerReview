import { notFound } from "next/navigation";
import { getExercise } from "@/lib/supabase/queries";
import { ReviewLayout } from "@/components/review/review-layout";

type Params = Promise<{ id: string }>;

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) {
    const { id } = await params;
    const pr = await getExercise(id);

    if (!pr) {
        notFound();
    }

    return <ReviewLayout pr={pr}>{children}</ReviewLayout>;
}
