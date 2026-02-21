"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { Solution } from "@/lib/types";
import Link from "next/link";
import { fetchSolutionReplies, createSolutionReply } from "@/lib/supabase/actions";
import type { UserProfile } from "./discussion-tab";
import { ThreadRow, type ThreadReply } from "./thread-row";

interface SolutionRowProps {
    solution: Solution;
    prId: string;
    onUpvote: (id: string) => void;
    currentUser: UserProfile | null;
    onAuthRequired: () => void;
}

export function SolutionRow({ solution, prId, onUpvote, currentUser, onAuthRequired }: SolutionRowProps) {

    const initialReplies: ThreadReply[] = solution.replies?.map(r => ({
        id: r.id,
        content: r.content,
        author: r.author,
        createdAt: r.created_at
    })) ?? [];

    const handleFetchReplies = async (offset: number): Promise<ThreadReply[]> => {
        const data = await fetchSolutionReplies(solution.id, offset);
        return data.map(r => ({
            id: r.id,
            content: r.content,
            author: r.author,
            createdAt: r.created_at
        }));
    };

    const handleSubmitReply = async (content: string) => {
        const result = await createSolutionReply(prId, solution.id, content);
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

    const extraActions = (
        <Button
            variant="outline"
            size="sm"
            className="gap-2"
            asChild
        >
            <Link href={`/review/${prId}/solutions/${solution.id}`}>
                <ExternalLink className="h-4 w-4" />
                See Solution
            </Link>
        </Button>
    );

    return (
        <ThreadRow
            id={solution.id}
            content={solution.description}
            author={solution.author}
            createdAt={solution.created_at}
            upvotes={solution.upvotes}
            hasUpvoted={!!solution.hasUpvoted}
            replyCount={solution.replyCount}
            initialReplies={initialReplies}
            onUpvote={onUpvote}
            onAuthRequired={onAuthRequired}
            onFetchReplies={handleFetchReplies}
            onSubmitReply={handleSubmitReply}
            currentUser={currentUser}
            extraActions={extraActions}
        />
    );
}
