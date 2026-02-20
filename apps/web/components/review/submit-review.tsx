"use client";

import { Button } from "@workspace/ui/components/button";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import type { InlineComment, DiffFile } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { submitReview } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { LoginModal } from "@/components/auth/login-modal";
import { toast } from "sonner";

interface SubmitReviewProps {
    comments: Map<string, InlineComment>;
    files: DiffFile[];
    prId: string;
}

export function SubmitReview({ comments, files, prId }: SubmitReviewProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const supabase = createClient();

    const commentArray = Array.from(comments.values());
    const totalComments = commentArray.length;
    const criticalCount = commentArray.filter(
        (c) => c.severity === "critical"
    ).length;
    const suggestionCount = commentArray.filter(
        (c) => c.severity === "suggestion"
    ).length;
    const nitpickCount = commentArray.filter(
        (c) => c.severity === "nitpick"
    ).length;

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    setShowLoginModal(true);
                    return;
                }

                // Persist full comment map entries for the read-only view
                const entries = Array.from(comments.entries());
                localStorage.setItem(`review-comments-${prId}`, JSON.stringify(entries));

                // Prepare comments for backend
                const backendComments = commentArray.map(c => {
                    const file = files.find(f => f.id === c.file_id);
                    if (!file) {
                        console.error(`File not found with ID ${c.file_id}`);
                        return null;
                    }
                    return {
                        fileId: file.id,
                        lineIndex: c.line_index,
                        text: c.text,
                        severity: c.severity as "critical" | "suggestion" | "nitpick"
                    };
                }).filter((c): c is NonNullable<typeof c> => c !== null);

                const result = await submitReview({
                    exerciseId: prId,
                    comments: backendComments
                });

                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                toast.success("Review submitted successfully!");
                router.push(`/review/${prId}/feedback/${result.reviewId}`);
            } catch (error) {
                console.error("Error submitting review:", error);
                toast.error("An unexpected error occurred");
            }
        });
    };

    return (
        <>
            <LoginModal
                isOpen={showLoginModal}
                onOpenChange={setShowLoginModal}
                title="Sign in to submit review"
                description="You need to be signed in to submit your code review."
            />
            <div className="border border-border/50 rounded-lg bg-card/30 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                {totalComments} comment{totalComments !== 1 ? "s" : ""}
                            </span>
                        </div>
                        {totalComments > 0 && (
                            <div className="flex items-center gap-3 text-[10px]">
                                {criticalCount > 0 && (
                                    <span className="text-red-400">
                                        {criticalCount} critical
                                    </span>
                                )}
                                {suggestionCount > 0 && (
                                    <span className="text-amber-400">
                                        {suggestionCount} suggestion{suggestionCount !== 1 ? "s" : ""}
                                    </span>
                                )}
                                {nitpickCount > 0 && (
                                    <span className="text-blue-400">
                                        {nitpickCount} nitpick{nitpickCount !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <Button onClick={handleSubmit} disabled={isPending || totalComments === 0}>
                        {isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Send className="h-3.5 w-3.5" />
                        )}
                        Submit Review
                    </Button>
                </div>
            </div>
        </>
    );
}
