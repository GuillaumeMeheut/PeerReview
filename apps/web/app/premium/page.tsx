import { Metadata } from "next";
import { Suspense } from "react";
import { PremiumPageContent } from "@/components/premium/premium-content";

export const metadata: Metadata = {
    title: "Premium",
    description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
    openGraph: {
        title: "PeerReview Premium — Unlimited AI Feedback",
        description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
        url: "https://peer-review.dev/premium",
        images: [{ url: "/pr-list.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "PeerReview Premium — Unlimited AI Feedback",
        description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
        images: ["/pr-list.png"],
    },
    alternates: { canonical: "https://peer-review.dev/premium" },
};

export default function PremiumPage() {
    return (
        <Suspense>
            <PremiumPageContent />
        </Suspense>
    );
}
