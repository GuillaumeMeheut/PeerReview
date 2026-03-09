import { cache } from "react";
import { createClient } from "../server";
import { handleQueryError } from "./utils";
import type { PullRequest, DiffFile, DiffChunk, DiffLine } from "../../types";

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

  if (handleQueryError(error, { context: "fetching exercises" })) {
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

  if (handleQueryError(error, { context: "fetching exercise" }) || !ex) {
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
  } as unknown as PullRequest & { expected_issues: import("../../types").ExpectedIssue[] };
});
