import { useState } from "react";
import { ArrowBigUp, ChevronDown, ChevronUp, Loader2, MessageSquare, Reply, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { DiscussionForm } from "./discussion-form";
import { fetchReplies, createDiscussionReply } from "@/lib/supabase/actions";
import type { Discussion, DiscussionReply } from "@/lib/types";
import type { UserProfile } from "./discussion-tab";
import { REPLIES_PAGE_SIZE } from "@/lib/constants";

interface DiscussionRowProps {
    exerciseId: string;
    discussion: Discussion;
    onUpvote: (id: string) => void;
    currentUser: UserProfile | null;
    onAuthRequired: () => void;
}

export function DiscussionRow({ exerciseId, discussion, onUpvote, currentUser, onAuthRequired }: DiscussionRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replies, setReplies] = useState<DiscussionReply[]>(discussion.discussion_replies ?? []);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(false);
    const [hasMoreReplies, setHasMoreReplies] = useState(discussion.replyCount > REPLIES_PAGE_SIZE);
    const [currentReplyCount, setCurrentReplyCount] = useState(Math.max(discussion.replyCount, discussion.discussion_replies?.length || 0));

    const handleToggleReplies = async () => {
        if (isExpanded) {
            setIsExpanded(false);
            return;
        }

        // Fetch replies on first expand
        if (!repliesLoaded) {
            setIsLoadingReplies(true);
            const data = await fetchReplies(discussion.id, 0);
            setReplies(data);
            setRepliesLoaded(true);
            setHasMoreReplies(data.length >= REPLIES_PAGE_SIZE);
            setIsLoadingReplies(false);
        }

        setIsExpanded(true);
    };

    const handleLoadMoreReplies = async () => {
        setIsLoadingMore(true);
        const more = await fetchReplies(discussion.id, replies.length);
        if (more.length < REPLIES_PAGE_SIZE) {
            setHasMoreReplies(false);
        }
        setReplies((prev) => [...prev, ...more]);
        setIsLoadingMore(false);
    };

    const handleReplySubmit = async (content: string) => {
        if (!currentUser) {
            onAuthRequired();
            return;
        }
        const result = await createDiscussionReply(exerciseId, discussion.id, content);
        if (result.error || !result.id) return;

        setIsReplying(false);

        const newReply: DiscussionReply = {
            id: result.id,
            author: { name: currentUser.name, avatar: currentUser.avatar || "" },
            content,
            created_at: new Date().toISOString(),
            discussion_id: discussion.id,
            user_id: "temp-user-id",
            profiles: null
        };
        setReplies((prev) => [...prev, newReply]);
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
                    className={`h-8 w-8 p-0 transition-colors ${discussion.hasUpvoted
                        ? "text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    onClick={() => onUpvote(discussion.id)}
                >
                    <ArrowBigUp className={`h-6 w-6 ${discussion.hasUpvoted ? "fill-current" : ""}`} />
                </Button>
                <span className={`text-sm font-medium ${discussion.hasUpvoted ? "text-orange-500" : "text-muted-foreground"
                    }`}>
                    {discussion.upvotes}
                </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={discussion.author?.avatar || ""} />
                        <AvatarFallback>{discussion.author?.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                        {discussion.author?.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90">
                    {discussion.content}
                </p>

                <div className="flex items-center pt-1 gap-2">
                    {(currentReplyCount > 0) && (
                        <div className="flex items-center border rounded-md border-border/50 overflow-hidden">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground border-r border-border/50 bg-muted/20">
                                <MessageSquare className="h-3.5 w-3.5" />
                                <span className="font-medium">{currentReplyCount}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto py-1 px-2 text-xs rounded-none border-none hover:bg-muted gap-1 text-muted-foreground hover:text-foreground"
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
                        className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
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

function ReplyRow({ reply }: { reply: DiscussionReply }) {
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
                        • {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-foreground/90 max-w-4xl">{reply.content}</p>
            </div>
        </div>
    );
}
