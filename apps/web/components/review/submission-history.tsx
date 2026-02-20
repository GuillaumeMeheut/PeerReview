"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchUserReviewHistory } from "@/lib/supabase/actions";
import { Button } from "@workspace/ui/components/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { ChevronDown, Loader2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SubmissionHistoryProps {
    exerciseId: string;
    currentReviewId?: string;
}

interface ReviewHistoryItem {
    id: string;
    createdAt: string;
    commentCount: number;
}

// Module-level cache to persist state across client-side navigations
const historyCache = new Map<string, ReviewHistoryItem[]>();
let isHistoryOpen = false;

export function SubmissionHistory({ exerciseId, currentReviewId }: SubmissionHistoryProps) {
    const [isOpen, setIsOpen] = useState(isHistoryOpen);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<ReviewHistoryItem[] | null>(
        historyCache.get(exerciseId) || null
    );

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        isHistoryOpen = open;

        if (open && history === null) {
            setIsLoading(true);
            try {
                const data = await fetchUserReviewHistory(exerciseId);
                historyCache.set(exerciseId, data);
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={handleOpenChange}
            className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 h-auto hover:bg-muted/50 rounded-none transition-colors"
                >
                    <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        Submission History
                    </div>
                    <ChevronDown
                        className="w-5 h-5 text-muted-foreground transition-transform duration-200"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="p-4 border-t">
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : history?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4 text-sm">
                            No previous submissions found.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {history?.map((item) => {
                                const isCurrent = item.id === currentReviewId;
                                return (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded-md ${isCurrent ? 'border-primary ring-1 ring-primary bg-primary/5' : 'bg-muted/20'
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {new Date(item.createdAt).toLocaleDateString()} at{" "}
                                                {new Date(item.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                                {isCurrent && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        Current
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDistanceToNow(new Date(item.createdAt), {
                                                    addSuffix: true,
                                                })}
                                                {" • "}
                                                {item.commentCount} comment{item.commentCount !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                                Show solution
                                            </Button>
                                            {isCurrent ? (
                                                <Button variant="secondary" size="sm" className="h-8 text-xs" disabled>
                                                    Current review
                                                </Button>
                                            ) : (
                                                <Button variant="default" size="sm" className="h-8 text-xs" asChild>
                                                    <Link href={`/review/${exerciseId}/feedback/${item.id}`}>
                                                        See feedback
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
