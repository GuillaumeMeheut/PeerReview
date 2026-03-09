"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { PullRequest } from "@/lib/types";

interface PRCardLinkProps {
    pr: PullRequest;
    totalAdditions: number;
    totalDeletions: number;
    children: React.ReactNode;
}

export function PRCardLink({ pr, totalAdditions, totalDeletions, children }: PRCardLinkProps) {
    return (
        <Link
            href={`/review/${pr.id}`}
            className="block group h-full"
            onClick={() => {
                posthog.capture("review_started", {
                    pr_id: pr.id,
                    pr_title: pr.title,
                    difficulty: pr.difficulty,
                    tech_stack: pr.tech_stack,
                    tags: pr.tags,
                    file_count: pr.exercise_files.length,
                    total_additions: totalAdditions,
                    total_deletions: totalDeletions,
                });
            }}
        >
            {children}
        </Link>
    );
}
