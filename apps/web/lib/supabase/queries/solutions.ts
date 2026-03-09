import { createClient } from "../server";
import { handleQueryError } from "./utils";
import { REPLIES_PAGE_SIZE } from "@/lib/constants";
import type { Solution, InlineComment, SolutionReply } from "../../types";

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

  if (handleQueryError(error, { context: "fetching solutions" })) {
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

  if (handleQueryError(error, { context: "fetching solution replies" })) {
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
          line_end_index,
          text,
          review_id,
          created_at
        )
      )
    `)
    .eq("id", solutionId)
    .single();

  if (handleQueryError(error, { context: "fetching solution comments", ignorePGRST116: true })) {
    return [];
  }

  if (!data) return [];

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
