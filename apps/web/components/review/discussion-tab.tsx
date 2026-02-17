import { Discussion, DiscussionReply } from "@/lib/types";
import { useState } from "react";
import { DiscussionRow } from "./discussion-row";
import { NewDiscussionForm } from "./new-discussion-form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { getPRDiscussions } from "@/lib/mock-data";

type DiscussionTabProps = {
    prId: string;
}

export function DiscussionTab({ prId }: DiscussionTabProps) {
    const [discussions, setDiscussions] = useState<Discussion[]>(() => getPRDiscussions(prId));

    const handleUpvote = (id: string) => {
        setDiscussions((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d
            )
        );
    };

    const handleReply = (discussionId: string, content: string) => {
        setDiscussions((prev) =>
            prev.map((d) => {
                if (d.id === discussionId) {
                    const newReply: DiscussionReply = {
                        id: `r-${Date.now()}`,
                        author: {
                            name: "You",
                            avatar: "https://github.com/shadcn.png",
                        },
                        content,
                        timestamp: Date.now(),
                    };
                    return {
                        ...d,
                        replies: [...(d.replies || []), newReply],
                        replyCount: d.replyCount + 1,
                    };
                }
                return d;
            })
        );
    };

    const handleAddDiscussion = (content: string) => {
        const newDiscussion: Discussion = {
            id: `d-${Date.now()}`,
            author: {
                name: "You",
                avatar: "https://github.com/shadcn.png",
            },
            content,
            timestamp: Date.now(),
            upvotes: 0,
            replyCount: 0,
            replies: [],
        };
        setDiscussions((prev) => [newDiscussion, ...prev]);
    };

    const listContent = discussions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed rounded-lg border-border/50 bg-muted/20">
            <p className="text-sm font-medium">No discussions yet</p>
            <p className="text-xs mt-1 opacity-60">
                Be the first to start a conversation about this PR
            </p>
        </div>
    ) : (
        <div className="space-y-4">
            {discussions.map((discussion) => (
                <DiscussionRow
                    key={discussion.id}
                    discussion={discussion}
                    onUpvote={handleUpvote}
                    onReply={handleReply}
                />
            ))}
        </div>
    );

    return (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6 max-w-3xl mx-auto py-4">
                <NewDiscussionForm onAddDiscussion={handleAddDiscussion} />
                {listContent}
            </div>
        </ScrollArea>
    );
}
