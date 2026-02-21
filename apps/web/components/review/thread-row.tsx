import { useState } from "react";
import { ArrowBigUp, ChevronDown, ChevronUp, Loader2, MessageSquare, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { DiscussionForm } from "./discussion-form";
import type { UserProfile } from "./discussion-tab";
import { REPLIES_PAGE_SIZE } from "@/lib/constants";

export interface ThreadReply {
    id: string;
    author?: { name?: string; avatar?: string };
    content: string;
    createdAt: string;
}

export interface ThreadRowProps {
    id: string;
    content: string;
    author?: { name?: string; avatar?: string };
    createdAt: string;
    upvotes: number;
    hasUpvoted: boolean;
    replyCount: number;
    initialReplies?: ThreadReply[];

    // Actions
    onUpvote: (id: string) => void;
    onAuthRequired: () => void;
    onFetchReplies: (offset: number) => Promise<ThreadReply[]>;
    onSubmitReply: (content: string) => Promise<{ error?: string; reply?: ThreadReply }>;

    // Auth State
    currentUser: UserProfile | null;

    // Optional slot for extra actions (e.g., "See Solution" button)
    extraActions?: React.ReactNode;
}

export function ThreadRow({
    id,
    content,
    author,
    createdAt,
    upvotes,
    hasUpvoted,
    replyCount,
    initialReplies = [],
    onUpvote,
    onAuthRequired,
    onFetchReplies,
    onSubmitReply,
    currentUser,
    extraActions
}: ThreadRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replies, setReplies] = useState<ThreadReply[]>(initialReplies);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(initialReplies.length > 0);
    const [hasMoreReplies, setHasMoreReplies] = useState(replyCount > REPLIES_PAGE_SIZE);
    const [currentReplyCount, setCurrentReplyCount] = useState(Math.max(replyCount, initialReplies.length));

    const handleToggleReplies = async () => {
        if (isExpanded) {
            setIsExpanded(false);
            return;
        }

        // Fetch replies on first expand if we don't have them
        if (!repliesLoaded) {
            setIsLoadingReplies(true);
            const data = await onFetchReplies(0);
            setReplies(data);
            setRepliesLoaded(true);
            setHasMoreReplies(data.length >= REPLIES_PAGE_SIZE);
            setIsLoadingReplies(false);
        }

        setIsExpanded(true);
    };

    const handleLoadMoreReplies = async () => {
        setIsLoadingMore(true);
        const more = await onFetchReplies(replies.length);
        if (more.length < REPLIES_PAGE_SIZE) {
            setHasMoreReplies(false);
        }
        setReplies((prev) => [...prev, ...more]);
        setIsLoadingMore(false);
    };

    const handleReplySubmit = async (replyContent: string) => {
        if (!currentUser) {
            onAuthRequired();
            return;
        }

        const result = await onSubmitReply(replyContent);
        if (result.error || !result.reply) return;

        setIsReplying(false);
        setReplies((prev) => [...prev, result.reply!]);
        setCurrentReplyCount((prev) => prev + 1);
        setRepliesLoaded(true);
        setIsExpanded(true);
    };

    return (
        <div className="flex gap-4 p-4 border rounded-lg border-border/50 bg-card hover:border-border transition-colors">
            {/* Upvote Column */}
            <div className="flex flex-col items-center gap-1 min-w-[32px]">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 transition-colors ${hasUpvoted
                        ? "text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    onClick={() => onUpvote(id)}
                >
                    <ArrowBigUp className={`h-6 w-6 ${hasUpvoted ? "fill-current" : ""}`} />
                </Button>
                <span className={`text-sm font-medium ${hasUpvoted ? "text-orange-500" : "text-muted-foreground"
                    }`}>
                    {upvotes}
                </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={author?.avatar || ""} />
                        <AvatarFallback>{author?.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                        {author?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90 max-w-4xl">
                    {content}
                </p>

                <div className="flex items-center pt-1 gap-2">
                    {extraActions}

                    {(currentReplyCount > 0) && (
                        <div className={`flex items-center border rounded-md border-border/50 overflow-hidden ${extraActions ? "ml-2 h-8" : ""}`}>
                            <div className={`flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground border-r border-border/50 bg-muted/20 ${extraActions ? "h-full" : ""}`}>
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="font-medium">{currentReplyCount}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-auto py-1 px-2 text-xs rounded-none border-none hover:bg-muted gap-1 text-muted-foreground hover:text-foreground ${extraActions ? "h-full" : ""}`}
                                onClick={handleToggleReplies}
                            >
                                {isLoadingReplies ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isExpanded ? (
                                    <>
                                        <ChevronUp className="h-3.5 w-3.5" />
                                        Hide
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                        Show
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5 ${extraActions ? "ml-2" : ""}`}
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        <Reply className="h-3 w-3" />
                        Reply
                    </Button>
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <DiscussionForm
                            onSubmit={handleReplySubmit}
                            onCancel={() => setIsReplying(false)}
                            submitLabel="Reply"
                            placeholder="Write a reply..."
                        />
                    </div>
                )}

                {/* Replies List */}
                {isExpanded && replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Replies</h4>
                        {replies.map((reply) => (
                            <ReplyRow key={reply.id} reply={reply} />
                        ))}
                        {hasMoreReplies && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-muted-foreground hover:text-foreground"
                                onClick={handleLoadMoreReplies}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                                ) : null}
                                Show more replies
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ReplyRow({ reply }: { reply: ThreadReply }) {
    return (
        <div className="flex gap-3 relative pl-4 border-l-2 border-border/50">
            <Avatar className="h-6 w-6">
                <AvatarImage src={reply.author?.avatar || ""} />
                <AvatarFallback>{reply.author?.name?.[0] || 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{reply.author?.name || 'Anonymous'}</span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-foreground/90 max-w-4xl">{reply.content}</p>
            </div>
        </div>
    );
}
