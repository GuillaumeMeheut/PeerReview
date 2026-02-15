import { Discussion } from "@/lib/types";
import { DiscussionRow } from "./discussion-row";
import { NewDiscussionForm } from "./new-discussion-form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

interface DiscussionTabProps {
    discussions: Discussion[];
    onUpvote: (id: string) => void;
    onReply: (discussionId: string, content: string) => void;
    onAddDiscussion: (content: string) => void;
}

export function DiscussionTab({ discussions, onUpvote, onReply, onAddDiscussion }: DiscussionTabProps) {
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
                    onUpvote={onUpvote}
                    onReply={onReply}
                />
            ))}
        </div>
    );

    return (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6 max-w-3xl mx-auto py-4">
                <NewDiscussionForm onAddDiscussion={onAddDiscussion} />
                {listContent}
            </div>
        </ScrollArea>
    );
}
