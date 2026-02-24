import { cache } from "react";
import { createClient } from "./server";
import type { PullRequest, DiffFile, DiffChunk, DiffLine, Discussion, DiscussionReply, Solution, InlineComment, SolutionReply } from "../types";

// type SupabaseClient = ReturnType<typeof createClient>;

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

/**
 * Fetches all exercises with their files (no chunks).
 * Suitable for the problems listing page where we need metadata + file stats.
 */
export const getExercises = cache(async (): Promise<PullRequest[]> => {
  const supabase = await createClient();

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select(`
      id,
      title,
      description,
      difficulty,
      tech_stack,
      tags,
      author,
      base_branch,
      head_branch,
      exercise_files (
        id,
        path,
        additions,
        deletions,
        sort_order
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }

  return (exercises ?? []).map((ex) => {
    const exercise_files: DiffFile[] = (ex.exercise_files ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((f: any) => ({
        ...f,
        file_chunks: [],
      }));

    return {
      ...ex,
      exercise_files,
    } as PullRequest;
  });
});

/**
 * Fetches a single exercise with full file data including diff chunks.
 * Used on the review page where we need the complete diff content.
 */
export const getExercise = cache(async (id: string): Promise<PullRequest | null> => {
  const supabase = await createClient();

  const { data: ex, error } = await supabase
    .from("exercises")
    .select(`
      id,
      created_at,
      title,
      description,
      difficulty,
      tech_stack,
      tags,
      author,
      base_branch,
      head_branch,
      commonly_missed,
      exercise_files (
        id,
        path,
        additions,
        deletions,
        sort_order,
        file_chunks (
          id,
          header,
          lines,
          sort_order
        )
      ),
      exercise_expected_issues (
        id,
        exercise_id,
        title,
        description,
        severity,
        line,
        sort_order
      )
    `)
    .eq("id", id)
    .single();

  if (error || !ex) {
    console.error("Error fetching exercise:", error);
    return null;
  }

  const exercise_files: DiffFile[] = (ex.exercise_files ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((f: any) => ({
      ...f,
      file_chunks: (f.file_chunks ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((c: any): DiffChunk => ({
          ...c,
          lines: c.lines as DiffLine[],
        })),
    }));

  return {
    ...ex,
    exercise_files,
    expected_issues: (ex.exercise_expected_issues ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
  } as unknown as PullRequest & { expected_issues: import("../types").ExpectedIssue[] };
});

import { DISCUSSIONS_PAGE_SIZE, REPLIES_PAGE_SIZE } from "@/lib/constants";
/**
 * Fetches discussions for an exercise, including author profiles and vote counts.
 * Replies are NOT loaded here — they are fetched on-demand when expanded.
 */
export async function getDiscussions(
  exerciseId: string,
  { limit = DISCUSSIONS_PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<Discussion[]> {
  const supabase = await createClient();

  // Fetch current user to check their votes
  const { user } = await getUser();

  const { data: discussions, error } = await supabase
    .from("discussions")
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      ),
      discussion_votes(count),
      discussion_replies(count)
    `)
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }

  // Fetch which discussions the current user has voted on
  let votedIds = new Set<string>();
  if (user && discussions?.length) {
    const { data: votes } = await supabase
      .from("discussion_votes")
      .select("discussion_id")
      .eq("user_id", user.id)
      .in("discussion_id", discussions.map((d: any) => d.id));

    votedIds = new Set((votes ?? []).map((v: any) => v.discussion_id));
  }

  return (discussions ?? []).map((d: any) => {
    const profiles = d.profiles;

    return {
      ...d,
      profiles,
      author: {
        name: profiles?.full_name || profiles?.username || "Anonymous",
        avatar: profiles?.avatar_url || "",
      },
      upvotes: d.discussion_votes?.[0]?.count ?? 0,
      hasUpvoted: votedIds.has(d.id),
      replyCount: d.discussion_replies?.[0]?.count ?? 0,
      discussion_replies: [], // Loaded on-demand
    } as Discussion;
  });
}

/**
 * Fetches replies for a specific discussion. Called on-demand when user expands replies.
 */
export async function getDiscussionReplies(
  discussionId: string,
  { limit = REPLIES_PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<DiscussionReply[]> {
  const supabase = await createClient();

  const { data: replies, error } = await supabase
    .from("discussion_replies")
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("discussion_id", discussionId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }

  return (replies ?? []).map((r: any): DiscussionReply => {
    const profiles = r.profiles;
    return {
      ...r,
      profiles,
      author: {
        name: profiles?.full_name || profiles?.username || "Anonymous",
        avatar: profiles?.avatar_url || "",
      }
    } as DiscussionReply;
  });
}

export async function getSolutions(exerciseId: string): Promise<any[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solutions")
    .select(`
            id,
            description,
            created_at,
            user_id,
            profiles:user_id (
                username,
                full_name,
                avatar_url
            ),
            solution_votes(count),
            solution_replies(count)
        `)
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching solutions:", error);
    return [];
  }

  // Transform to match Solution interface
  return (data ?? []).map((s: any) => ({
    ...s,
    author: {
      name: s.profiles?.full_name || s.profiles?.username || "Anonymous",
      avatar: s.profiles?.avatar_url || "",
    },
    upvotes: s.solution_votes?.[0]?.count ?? 0,
    replyCount: s.solution_replies?.[0]?.count ?? 0,
    replies: [], // Fetched on demand
  } as Solution));
}

/**
 * Fetches replies for a specific solution. Called on-demand when user expands replies.
 */
export async function getSolutionReplies(
  solutionId: string,
  { limit = REPLIES_PAGE_SIZE, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<SolutionReply[]> {
  const supabase = await createClient();

  const { data: replies, error } = await supabase
    .from("solution_replies")
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq("solution_id", solutionId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching solution replies:", error);
    return [];
  }

  return (replies ?? []).map((r: any): SolutionReply => {
    const profiles = r.profiles;
    return {
      ...r,
      profiles,
      author: {
        name: profiles?.full_name || profiles?.username || "Anonymous",
        avatar: profiles?.avatar_url || "",
      }
    } as SolutionReply;
  });
}

export async function getSolutionComments(solutionId: string): Promise<InlineComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("solutions")
    .select(`
      user_reviews (
        user_id,
        profiles:user_id (
          username,
          full_name,
          avatar_url
        ),
        review_comments (
          id,
          file_id,
          line_index,
          severity,
          text,
          review_id,
          created_at
        )
      )
    `)
    .eq("id", solutionId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching solution comments:", error);
    }
    return [];
  }

  const review = data?.user_reviews as any;
  const reviewObj = Array.isArray(review) ? review[0] : review;
  const comments = reviewObj?.review_comments ?? [];
  const profiles = reviewObj?.profiles;

  const authorProfile = Array.isArray(profiles) ? profiles[0] : profiles;

  return comments.map((c: any) => ({
    ...c,
    profiles: authorProfile,
    author: {
      name: authorProfile?.full_name || authorProfile?.username || "Anonymous",
      avatar: authorProfile?.avatar_url || "",
    }
  } as InlineComment));
}

export async function getReviewComments(reviewId: string): Promise<InlineComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("review_comments")
    .select(`
      id,
      file_id,
      line_index,
      severity,
      text,
      review_id,
      created_at
    `)
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching review comments:", error);
    return [];
  }

  // Map to InlineComment, defaulting author since it's not needed for the AI prompt
  return (data ?? []).map((c: any) => ({
    ...c,
    profiles: null,
    author: {
      name: "Reviewer",
      avatar: "",
    }
  } as InlineComment));
}

export async function getLatestUserReview(exerciseId: string): Promise<string | null> {
  const { user } = await getUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_reviews")
    .select("id")
    .eq("exercise_id", exerciseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== "PGRST116") { // ignores "Returns zero rows" error
      console.error("Error fetching latest review:", error);
    }
    return null;
  }

  return data?.id ?? null;
}

export async function getUserReviewHistory(exerciseId: string) {
  const { user } = await getUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_reviews")
    .select(`
      id,
      created_at,
      review_comments(count)
    `)
    .eq("exercise_id", exerciseId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user review history:", error);
    return [];
  }

  return (data ?? []).map((review: any) => ({
    id: review.id,
    createdAt: review.created_at,
    commentCount: review.review_comments?.[0]?.count ?? 0,
  }));
}

export async function getAIFeedbackForReview(reviewId: string): Promise<import("../types").StructuredFeedback | null> {
  const supabase = await createClient();

  const { data: existingFeedback, error } = await supabase
    .from('ai_feedback_results')
    .select('summary, strengths, improvements, technical_accuracy, communication_style, constructiveness, completeness, comment_feedback, overall_score')
    .eq('review_id', reviewId)
    .single();

  if (error || !existingFeedback) {
    if (error && error.code !== "PGRST116") { // ignore not found
      console.error("Error fetching AI feedback:", error);
    }
    return null;
  }

  return {
    summary: existingFeedback.summary,
    strengths: existingFeedback.strengths,
    improvements: existingFeedback.improvements,
    metrics: {
      technical_accuracy: existingFeedback.technical_accuracy,
      communication_style: existingFeedback.communication_style,
      constructiveness: existingFeedback.constructiveness,
      completeness: existingFeedback.completeness,
    },
    commentFeedback: existingFeedback.comment_feedback ?? [],
    overallScore: existingFeedback.overall_score,
  };
}
