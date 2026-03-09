import { Metadata } from "next";
import { Suspense } from "react";
import { PremiumPageContent } from "@/components/premium/premium-content";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

export const metadata: Metadata = {
    title: "Premium",
    description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
    openGraph: {
        title: "PeerReview Premium — Unlimited AI Feedback",
        description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
        url: `${baseUrl}/premium`,
        images: [{ url: "/pr-list.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "PeerReview Premium — Unlimited AI Feedback",
        description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
        images: ["/pr-list.png"],
    },
    alternates: { canonical: `${baseUrl}/premium` },
};

export default async function PremiumPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const success = params.success === "true";
    const canceled = params.canceled === "true";

    return (
        <Suspense>
            <PremiumPageContent success={success} canceled={canceled} />
        </Suspense>
    );
}
