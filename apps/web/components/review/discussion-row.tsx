import { fetchReplies, createDiscussionReply } from "@/lib/supabase/actions";
import type { Discussion } from "@/lib/types";
import type { UserProfile } from "./discussion-tab";
import { ThreadRow, type ThreadReply } from "./thread-row";

interface DiscussionRowProps {
    exerciseId: string;
    discussion: Discussion;
    onUpvote: (id: string) => void;
    currentUser: UserProfile | null;
    onAuthRequired: () => void;
}

export function DiscussionRow({ exerciseId, discussion, onUpvote, currentUser, onAuthRequired }: DiscussionRowProps) {

    const initialReplies: ThreadReply[] = discussion.discussion_replies?.map(r => ({
        id: r.id,
        content: r.content,
        author: r.author,
        createdAt: r.created_at
    })) ?? [];

    const handleFetchReplies = async (offset: number): Promise<ThreadReply[]> => {
        const data = await fetchReplies(discussion.id, offset);
        return data.map(r => ({
            id: r.id,
            content: r.content,
            author: r.author,
            createdAt: r.created_at
        }));
    };

    const handleSubmitReply = async (content: string) => {
        const result = await createDiscussionReply(exerciseId, discussion.id, content);
        if (result.error || !result.id) return { error: result.error };

        return {
            reply: {
                id: result.id,
                author: { name: currentUser?.name, avatar: currentUser?.avatar || "" },
                content,
                createdAt: new Date().toISOString()
            }
        };
    };

    return (
        <ThreadRow
            id={discussion.id}
            content={discussion.content}
            author={discussion.author}
            createdAt={discussion.created_at}
            upvotes={discussion.upvotes}
            hasUpvoted={!!discussion.hasUpvoted}
            replyCount={discussion.replyCount}
            initialReplies={initialReplies}
            onUpvote={onUpvote}
            onAuthRequired={onAuthRequired}
            onFetchReplies={handleFetchReplies}
            onSubmitReply={handleSubmitReply}
            currentUser={currentUser}
        />
    );
}
