import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExercise } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const pr = await getExercise(id);

    if (!pr) return {};

    return {
        title: pr.title,
        description: pr.description || `Review pull request: ${pr.title}`,
        openGraph: {
            title: pr.title,
            description: pr.description || `Review pull request: ${pr.title}`,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: pr.title,
            description: pr.description || `Review pull request: ${pr.title}`,
        },
    };
}

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
