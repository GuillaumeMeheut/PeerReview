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

export async function toggleSolutionVote(exerciseId: string, solutionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to vote" };
    }

    // Check if vote already exists
    const { data: existing } = await supabase
        .from("solution_votes")
        .select("id")
        .eq("solution_id", solutionId)
        .eq("user_id", user.id)
        .single();

    if (existing) {
        // Remove vote (toggle off)
        await supabase.from("solution_votes").delete().eq("id", existing.id);
    } else {
        // Add vote
        const { error } = await supabase
            .from("solution_votes")
            .insert({ solution_id: solutionId, user_id: user.id });

        if (error) {
            console.error("Error voting:", error);
            return { error: "Failed to vote" };
        }
    }

    revalidatePath(`/review/${exerciseId}/solutions`);
    return { success: true };
}

export async function createSolutionReply(exerciseId: string, solutionId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to reply" };
    }

    const { data, error } = await supabase
        .from("solution_replies")
        .insert({ solution_id: solutionId, user_id: user.id, content })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Error creating reply:", error);
        return { error: "Failed to create reply" };
    }

    revalidatePath(`/review/${exerciseId}/solutions`);
    return { success: true, id: data.id as string };
}

export async function fetchReplies(discussionId: string, offset = 0) {
    const { getDiscussionReplies } = await import("@/lib/supabase/queries");
    return getDiscussionReplies(discussionId, { offset });
}

export async function fetchSolutionReplies(solutionId: string, offset = 0) {
    const { getSolutionReplies } = await import("@/lib/supabase/queries");
    return getSolutionReplies(solutionId, { offset });
}

export async function fetchMoreDiscussions(exerciseId: string, offset: number) {
    const { getDiscussions } = await import("@/lib/supabase/queries");
    return getDiscussions(exerciseId, { offset });
}

interface SubmitReviewParams {
    exerciseId: string;
    comments: {
        fileId: string;
        lineIndex: number;
        text: string;
        severity: "critical" | "suggestion" | "nitpick";
    }[];
}

export async function submitReview({ exerciseId, comments }: SubmitReviewParams) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to submit a review" };
    }

    // 1. Create new submitted review
    const { data: newReview, error } = await supabase
        .from("user_reviews")
        .insert({
            user_id: user.id,
            exercise_id: exerciseId,
        })
        .select("id")
        .single();

    if (error || !newReview) {
        console.error("Error creating review:", error);
        return { error: "Failed to create review" };
    }
    const reviewId = newReview.id;

    // 2. Insert comments
    if (comments.length > 0) {
        const commentsToInsert = comments.map(c => ({
            review_id: reviewId,
            file_id: c.fileId,
            line_index: c.lineIndex,
            text: c.text,
            severity: c.severity
        }));

        const { error: commentsError } = await supabase
            .from("review_comments")
            .insert(commentsToInsert);

        if (commentsError) {
            console.error("Error inserting comments:", commentsError);
            return { error: "Failed to save comments" };
        }
    }

    revalidatePath(`/review/${exerciseId}`);
    return { success: true, reviewId };
}

export async function fetchUserReviewHistory(exerciseId: string) {
    const { getUserReviewHistory } = await import("@/lib/supabase/queries");
    return getUserReviewHistory(exerciseId);
}

interface SubmitSolutionParams {
    exerciseId: string;
    description: string;
    userReviewId: string | null;
}

export async function submitSolution({ exerciseId, description, userReviewId }: SubmitSolutionParams) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to submit a solution" };
    }

    const { data, error } = await supabase
        .from("solutions")
        .insert({
            exercise_id: exerciseId,
            user_id: user.id,
            description,
            user_review_id: userReviewId
        })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Error creating solution:", error);
        return { error: "Failed to create solution" };
    }

    revalidatePath(`/review/${exerciseId}/solutions`);
    return { success: true, id: data.id as string };
}
