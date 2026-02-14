"use client";

import { Button } from "@workspace/ui/components/button";
import { MessageSquare, Send } from "lucide-react";
import type { InlineComment, DiffFile } from "@/lib/types";

interface SubmitReviewProps {
    comments: Map<string, InlineComment>;
    files: DiffFile[];
    prId: string;
    onSubmit: () => void;
}

export function SubmitReview({ comments, files, prId, onSubmit }: SubmitReviewProps) {
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
        // Persist full comment map entries for the read-only view
        const entries = Array.from(comments.entries());
        localStorage.setItem(`review-comments-${prId}`, JSON.stringify(entries));
        onSubmit();
    };

    return (
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

                <Button onClick={handleSubmit}>
                    <Send className="h-3.5 w-3.5" />
                    Submit Review
                </Button>
            </div>
        </div>
    );
}
