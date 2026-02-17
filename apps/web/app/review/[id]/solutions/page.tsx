"use client";

import { useRouter } from "next/navigation";
import { SolutionsTab } from "@/components/review/solutions-tab";
import { use } from "react";

type Params = Promise<{ id: string }>;

export default function SolutionsPage({ params }: { params: Params }) {
    // Unwrap params using use() hook since it's a promise in Next.js 15+
    const { id } = use(params);
    const router = useRouter();

    return (
        <SolutionsTab
            prId={id}
            onSelectSolution={(solutionId) => router.push(`/review/${id}/solutions/${solutionId}`)}
        />
    );
}
