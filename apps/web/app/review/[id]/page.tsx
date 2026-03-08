import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExercise } from "@/lib/supabase/queries";
import { ReviewClient } from "@/components/review/review-client";
import { JsonLd } from "@/components/json-ld";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const pr = await getExercise(id);

    if (!pr) return {};

    return {
        title: pr.title,
        description: pr.description || `Review pull request: ${pr.title}`,
        alternates: { canonical: `${baseUrl}/review/${id}` },
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
        <>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "LearningResource",
                "name": pr.title,
                "description": pr.description || `Review pull request: ${pr.title}`,
                "url": `${baseUrl}/review/${id}`,
                "educationalLevel": pr.difficulty,
                "keywords": pr.tech_stack?.join(", ") ?? "",
                "learningResourceType": "Exercise",
                "provider": {
                    "@type": "Organization",
                    "name": "PeerReview",
                    "url": baseUrl
                }
            }} />
            <ReviewClient pr={pr} />
        </>
    );
}
