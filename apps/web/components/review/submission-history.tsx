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
            className="relative"
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-normal border-dashed shadow-none bg-background hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>History:</span>
                    </div>
                    <span className="ml-2 font-medium">Submissions</span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 ml-2 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="absolute z-50 w-[320px] right-0 mt-2 bg-popover text-popover-foreground border rounded-xl shadow-md overflow-hidden transition-all data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : history?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6 text-sm">
                            No previous submissions found.
                        </p>
                    ) : (
                        <div className="flex flex-col">
                            {history?.map((item) => {
                                const isCurrent = item.id === currentReviewId;
                                return (
                                    <div
                                        key={item.id}
                                        className={`relative flex flex-col gap-2 p-3 text-sm transition-colors border-b border-border/50 last:border-0 ${isCurrent ? 'bg-muted/30' : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground">
                                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isCurrent && (
                                                        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.5)]" title="Current Review" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-0.5">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                    {" • "}
                                                    {item.commentCount} comment{item.commentCount !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-1.5">
                                            <Link
                                                href={`/review/${exerciseId}/${item.id}`}
                                                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                View Code
                                            </Link>
                                            <span className="text-muted-foreground/30 text-[10px]">•</span>
                                            {isCurrent ? (
                                                <span className="text-xs font-medium text-muted-foreground opacity-50 cursor-not-allowed">
                                                    Current Feedback
                                                </span>
                                            ) : (
                                                <Link
                                                    href={`/review/${exerciseId}/feedback/${item.id}`}
                                                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                                >
                                                    Switch to Feedback
                                                </Link>
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
