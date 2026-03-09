import { createClient } from "../server";
import { handleQueryError } from "./utils";
import { getUser } from "./auth";
import { DISCUSSIONS_PAGE_SIZE, REPLIES_PAGE_SIZE } from "@/lib/constants";
import type { Discussion, DiscussionReply } from "../../types";

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

  if (handleQueryError(error, { context: "fetching discussions" })) {
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

  if (handleQueryError(error, { context: "fetching replies" })) {
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
