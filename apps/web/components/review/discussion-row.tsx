import { useState } from "react";
import { ArrowBigUp, MessageSquare, Reply, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { DiscussionForm } from "./discussion-form";
import type { Discussion, DiscussionReply } from "@/lib/types";

interface DiscussionRowProps {
    discussion: Discussion;
    onUpvote: (id: string) => void;
    onReply: (discussionId: string, content: string) => void;
}

export function DiscussionRow({ discussion, onUpvote, onReply }: DiscussionRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    const handleReplySubmit = async (content: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        onReply(discussion.id, content);
        setIsReplying(false);
        setIsExpanded(true); // Auto-expand to show the new reply
    };

    return (
        <div className="flex gap-4 p-4 border rounded-lg border-border/50 bg-card hover:border-border transition-colors">
            {/* Upvote Column */}
            <div className="flex flex-col items-center gap-1 min-w-[32px]">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                    onClick={() => onUpvote(discussion.id)}
                >
                    <ArrowBigUp className="h-6 w-6" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground">
                    {discussion.upvotes}
                </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={discussion.author.avatar} />
                        <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                        {discussion.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(discussion.timestamp, { addSuffix: true })}
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90">
                    {discussion.content}
                </p>

                <div className="flex items-center pt-1 gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                        onClick={() => setIsExpanded(!isExpanded)}
                        disabled={discussion.replyCount === 0}
                    >
                        <MessageSquare className="h-3 w-3" />
                        {isExpanded ? "Hide" : "Show"} {discussion.replyCount} repl{discussion.replyCount === 1 ? "y" : "ies"}
                    </Button>
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
                {isExpanded && discussion.replies && discussion.replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Replies</h4>
                        {discussion.replies.map((reply) => (
                            <ReplyRow key={reply.id} reply={reply} />
                        ))}
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
                <AvatarImage src={reply.author.avatar} />
                <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{reply.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(reply.timestamp, { addSuffix: true })}
                    </span>
                </div>
                <p className="text-sm text-foreground/90">{reply.content}</p>
            </div>
        </div>
    );
}
