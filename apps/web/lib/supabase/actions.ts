"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDiscussion(exerciseId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to create a discussion" };
    }

    const { data, error } = await supabase
        .from("discussions")
        .insert({ exercise_id: exerciseId, user_id: user.id, content })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Error creating discussion:", error);
        return { error: "Failed to create discussion" };
    }

    revalidatePath(`/review/${exerciseId}/discussions`);
    return { success: true, id: data.id as string };
}

export async function toggleDiscussionVote(exerciseId: string, discussionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to vote" };
    }

    // Check if vote already exists
    const { data: existing } = await supabase
        .from("discussion_votes")
        .select("id")
        .eq("discussion_id", discussionId)
        .eq("user_id", user.id)
        .single();

    if (existing) {
        // Remove vote (toggle off)
        await supabase.from("discussion_votes").delete().eq("id", existing.id);
    } else {
        // Add vote
        const { error } = await supabase
            .from("discussion_votes")
            .insert({ discussion_id: discussionId, user_id: user.id });

        if (error) {
            console.error("Error voting:", error);
            return { error: "Failed to vote" };
        }
    }

    revalidatePath(`/review/${exerciseId}/discussions`);
    return { success: true };
}

export async function createDiscussionReply(exerciseId: string, discussionId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to reply" };
    }

    const { data, error } = await supabase
        .from("discussion_replies")
        .insert({ discussion_id: discussionId, user_id: user.id, content })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Error creating reply:", error);
        return { error: "Failed to create reply" };
    }

    revalidatePath(`/review/${exerciseId}/discussions`);
    return { success: true, id: data.id as string };
}

export async function fetchReplies(discussionId: string, offset = 0) {
    const { getDiscussionReplies } = await import("@/lib/supabase/queries");
    return getDiscussionReplies(discussionId, { offset });
}

export async function fetchMoreDiscussions(exerciseId: string, offset: number) {
    const { getDiscussions } = await import("@/lib/supabase/queries");
    return getDiscussions(exerciseId, { offset });
}
