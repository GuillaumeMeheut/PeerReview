import { cache } from "react";
import { createClient } from "./server";
import type { PullRequest, DiffFile, DiffChunk, DiffLine, Tag, Difficulty, Discussion, DiscussionReply } from "../types";

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
      commonly_missed,
      senior_example,
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
    const files: DiffFile[] = (ex.exercise_files ?? [])
      .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
      .map((f: { path: string; additions: number; deletions: number }) => ({
        path: f.path,
        additions: f.additions,
        deletions: f.deletions,
        chunks: [], // Not loaded for listing view
      }));

    return {
      id: ex.id,
      title: ex.title,
      description: ex.description,
      difficulty: ex.difficulty as Difficulty,
      techStack: ex.tech_stack,
      tags: ex.tags as Tag[],
      author: ex.author,
      baseBranch: ex.base_branch,
      headBranch: ex.head_branch,
      files,
      feedback: {
        score: 0,
        expectedIssues: [],
        commonlyMissed: ex.commonly_missed,
        seniorExample: ex.senior_example,
      },
    };
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
      title,
      description,
      difficulty,
      tech_stack,
      tags,
      author,
      base_branch,
      head_branch,
      commonly_missed,
      senior_example,
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
      )
    `)
    .eq("id", id)
    .single();

  if (error || !ex) {
    console.error("Error fetching exercise:", error);
    return null;
  }

  const files: DiffFile[] = (ex.exercise_files ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map((f: { path: string; additions: number; deletions: number; file_chunks?: { header: string; lines: DiffLine[]; sort_order: number }[] }) => ({
      path: f.path,
      additions: f.additions,
      deletions: f.deletions,
      chunks: (f.file_chunks ?? [])
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((c): DiffChunk => ({
          header: c.header,
          lines: c.lines as DiffLine[],
        })),
    }));

  return {
    id: ex.id,
    title: ex.title,
    description: ex.description,
    difficulty: ex.difficulty as Difficulty,
    techStack: ex.tech_stack,
    tags: ex.tags as Tag[],
    author: ex.author,
    baseBranch: ex.base_branch,
    headBranch: ex.head_branch,
    files,
    feedback: {
      score: 0,
      expectedIssues: [],
      commonlyMissed: ex.commonly_missed,
      seniorExample: ex.senior_example,
    },
  };
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
  const { data: { user } } = await supabase.auth.getUser();

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
    const author = d.profiles;

    return {
      id: d.id,
      author: {
        name: author?.full_name || author?.username || "Anonymous",
        avatar: author?.avatar_url || "",
      },
      content: d.content,
      timestamp: new Date(d.created_at).getTime(),
      upvotes: d.discussion_votes?.[0]?.count ?? 0,
      hasUpvoted: votedIds.has(d.id),
      replyCount: d.discussion_replies?.[0]?.count ?? 0,
      replies: [], // Loaded on-demand
    };
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

  return (replies ?? []).map((r: any): DiscussionReply => ({
    id: r.id,
    author: {
      name: r.profiles?.full_name || r.profiles?.username || "Anonymous",
      avatar: r.profiles?.avatar_url || "",
    },
    content: r.content,
    timestamp: new Date(r.created_at).getTime(),
  }));
}
