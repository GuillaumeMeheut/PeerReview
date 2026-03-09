import { createClient } from "../server";
import { handleQueryError } from "./utils";
import { getUser } from "./auth";
import type { InlineComment } from "../../types";

export async function getReviewComments(reviewId: string): Promise<InlineComment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("review_comments")
    .select(`
      id,
      file_id,
      line_index,
      line_end_index,
      text,
      review_id,
      created_at
    `)
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true });

  if (handleQueryError(error, { context: "fetching review comments" })) {
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

  if (handleQueryError(error, { context: "fetching latest review", ignorePGRST116: true })) {
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

  if (handleQueryError(error, { context: "fetching user review history" })) {
    return [];
  }

  return (data ?? []).map((review: any) => ({
    id: review.id,
    createdAt: review.created_at,
    commentCount: review.review_comments?.[0]?.count ?? 0,
  }));
}

export async function getAIFeedbackForReview(reviewId: string): Promise<import("../../types").StructuredFeedback | null> {
  const supabase = await createClient();

  const { data: existingFeedback, error } = await supabase
    .from('ai_feedback_results')
    .select('summary, strengths, improvements, technical_accuracy, communication_style, constructiveness, completeness, comment_feedback, overall_score')
    .eq('review_id', reviewId)
    .single();

  if (handleQueryError(error, { context: "fetching AI feedback", ignorePGRST116: true }) || !existingFeedback) {
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
