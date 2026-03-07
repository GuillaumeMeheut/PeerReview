import { Metadata } from "next";
import { Suspense } from "react";
import { PremiumPageContent } from "@/components/premium/premium-content";

export const metadata: Metadata = {
    title: "Premium",
    description: "Upgrade to PeerReview Pro for unlimited AI-powered code review feedback and priority support.",
};

export default function PremiumPage() {
    return (
        <Suspense>
            <PremiumPageContent />
        </Suspense>
    );
}
