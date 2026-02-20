"use client";

import { Discussion } from "@/lib/types";
import { useState, useRef, useCallback, useEffect } from "react";
import { DiscussionRow } from "./discussion-row";
import { NewDiscussionForm } from "./new-discussion-form";
import { createDiscussion, toggleDiscussionVote, fetchMoreDiscussions } from "@/lib/supabase/actions";
import { LoginModal } from "@/components/auth/login-modal";
import { Loader2 } from "lucide-react";
import { DISCUSSIONS_PAGE_SIZE } from "@/lib/constants";

export type UserProfile = {
    name: string;
    avatar: string;
}

type DiscussionTabProps = {
    exerciseId: string;
    initDiscussions: Discussion[];
    currentUser: UserProfile | null;
}

export function DiscussionTab({ exerciseId, initDiscussions, currentUser }: DiscussionTabProps) {
    const [discussions, setDiscussions] = useState<Discussion[]>(initDiscussions);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initDiscussions.length >= DISCUSSIONS_PAGE_SIZE);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        const more = await fetchMoreDiscussions(exerciseId, discussions.length);
        if (more.length < DISCUSSIONS_PAGE_SIZE) {
            setHasMore(false);
        }
        setDiscussions((prev) => [...prev, ...more]);
        setIsLoadingMore(false);
    }, [exerciseId, discussions.length, isLoadingMore, hasMore]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    const handleUpvote = async (id: string) => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        // Optimistic toggle
        const discussion = discussions.find((d) => d.id === id);
        if (!discussion) return;
        const wasUpvoted = discussion.hasUpvoted;

        setDiscussions((prev) =>
            prev.map((d) =>
                d.id === id
                    ? { ...d, upvotes: d.upvotes + (wasUpvoted ? -1 : 1), hasUpvoted: !wasUpvoted }
                    : d
            )
        );
        const result = await toggleDiscussionVote(exerciseId, id);
        if (result.error) {
            // Revert on error
            setDiscussions((prev) =>
                prev.map((d) =>
                    d.id === id
                        ? { ...d, upvotes: d.upvotes + (wasUpvoted ? 1 : -1), hasUpvoted: wasUpvoted }
                        : d
                )
            );
        }
    };

    const handleAddDiscussion = async (content: string) => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        const result = await createDiscussion(exerciseId, content);
        if (result.error || !result.id) return;

        const newDiscussion: Discussion = {
            id: result.id,
            author: {
                name: currentUser.name,
                avatar: currentUser.avatar,
            },
            content,
            created_at: new Date().toISOString(),
            upvotes: 0,
            hasUpvoted: false,
            replyCount: 0,
            discussion_replies: [],
            exercise_id: exerciseId,
            user_id: "temp-user-id",
            profiles: null,
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
                    exerciseId={exerciseId}
                    discussion={discussion}
                    onUpvote={handleUpvote}
                    currentUser={currentUser}
                    onAuthRequired={() => setShowLoginModal(true)}
                />
            ))}
            {/* Infinite scroll sentinel */}
            {hasMore && (
                <div ref={sentinelRef} className="flex justify-center py-4">
                    {isLoadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className="space-y-6 py-4">
                <NewDiscussionForm onAddDiscussion={handleAddDiscussion} />
                {listContent}
            </div>
            <LoginModal
                isOpen={showLoginModal}
                onOpenChange={setShowLoginModal}
                title="Sign in to join the discussion"
                description="You need to be signed in to interract with others."
            />
        </>
    );
}
