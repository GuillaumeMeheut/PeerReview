'use client'

import { Solution } from "@/lib/types";
import { SolutionRow } from "./solution-row";
import { Lock } from "lucide-react";
import { SubmitSolutionModal } from "./submit-solution-modal";
import { useState } from "react";
import { toggleSolutionVote } from "@/lib/supabase/actions";
import { LoginModal } from "@/components/auth/login-modal";
import type { UserProfile } from "./discussion-tab";

interface SolutionsTabProps {
    prId: string;
    initSolutions: Solution[];
    currentUser: UserProfile | null;
}

export function SolutionsTab({ prId, initSolutions, currentUser }: SolutionsTabProps) {
    const [solutions, setSolutions] = useState<Solution[]>(initSolutions);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleUpvote = async (id: string) => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        // Optimistic toggle
        const solution = solutions.find((s) => s.id === id);
        if (!solution) return;
        const wasUpvoted = solution.hasUpvoted;

        setSolutions((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, upvotes: s.upvotes + (wasUpvoted ? -1 : 1), hasUpvoted: !wasUpvoted }
                    : s
            )
        );
        const result = await toggleSolutionVote(prId, id);
        if (result.error) {
            // Revert on error
            setSolutions((prev) =>
                prev.map((s) =>
                    s.id === id
                        ? { ...s, upvotes: s.upvotes + (wasUpvoted ? 1 : -1), hasUpvoted: wasUpvoted }
                        : s
                )
            );
        }
    };

    const listContent = solutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Lock className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">No solutions yet</p>
            <p className="text-xs mt-1 opacity-60">
                Be the first to share your solution!
            </p>
        </div>
    ) : (
        <div className="space-y-4">
            {solutions.map((solution) => (
                <SolutionRow
                    key={solution.id}
                    solution={solution}
                    prId={prId}
                    onUpvote={handleUpvote}
                    currentUser={currentUser}
                    onAuthRequired={() => setShowLoginModal(true)}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Community Solutions</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {solutions.length} solution{solutions.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <SubmitSolutionModal prId={prId} />
            </div>
            {listContent}
            <LoginModal
                isOpen={showLoginModal}
                onOpenChange={setShowLoginModal}
                title="Sign in to interact"
                description="You need to be signed in to upvote and reply to solutions."
            />
        </div>
    );
}
