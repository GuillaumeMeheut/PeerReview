import { Database } from "./supabase/database.types";

export type Difficulty = "Junior" | "Mid" | "Senior";
export type Severity = "critical" | "suggestion" | "nitpick";
export type Tag =
    | "refactor"
    | "readability"
    | "architecture"
    | "tests"
    | "performance"
    | "accessibility";

export interface DiffLine {
    type: "added" | "removed" | "unchanged";
    content: string;
    oldLineNumber: number | null;
    newLineNumber: number | null;
}

// Map the core DB Row types
export type ExerciseRow = Database["public"]["Tables"]["exercises"]["Row"];
export type ExerciseFileRow = Database["public"]["Tables"]["exercise_files"]["Row"];
export type FileChunkRow = Database["public"]["Tables"]["file_chunks"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ExpectedIssueRow = Database["public"]["Tables"]["exercise_expected_issues"]["Row"];
export type DiscussionRowDB = Database["public"]["Tables"]["discussions"]["Row"];
export type DiscussionReplyRow = Database["public"]["Tables"]["discussion_replies"]["Row"];
export type SolutionReplyRow = Database["public"]["Tables"]["solution_replies"]["Row"];
export type SolutionRowDB = Database["public"]["Tables"]["solutions"]["Row"];
export type ReviewCommentRow = Database["public"]["Tables"]["review_comments"]["Row"];
export type FeedbackRow = Database["public"]["Tables"]["ai_feedback_results"]["Row"];

// Constructed Types with Relationships

export type DiffChunk = Omit<FileChunkRow, "lines"> & {
    lines: DiffLine[];
};

export type DiffFile = ExerciseFileRow & {
    file_chunks: DiffChunk[];
};

export type ExpectedIssue = ExpectedIssueRow;

export type DiscussionReply = DiscussionReplyRow & {
    profiles: Pick<ProfileRow, "username" | "full_name" | "avatar_url" | "github_url"> | null;
    author?: { name: string; avatar: string; githubUrl?: string };
};

export type Discussion = DiscussionRowDB & {
    profiles: Pick<ProfileRow, "username" | "full_name" | "avatar_url" | "github_url"> | null;
    upvotes: number;
    hasUpvoted: boolean;
    replyCount: number;
    discussion_replies?: DiscussionReply[];
    author?: { name: string; avatar: string; githubUrl?: string };
};

export type ReviewFeedback = FeedbackRow & {
    expected_issues?: ExpectedIssue[];
};

export interface FeedbackMetrics {
    technical_accuracy: number;
    communication_style: number;
    constructiveness: number;
    completeness: number;
}

export interface StructuredFeedback {
    summary: string;
    strengths: string[];
    improvements: string[];
    metrics: FeedbackMetrics;
    overallScore: number;
    commentFeedback?: {
        commentId: string;
        feedback: string;
        rating: number;
        category: "helpful" | "nitpick" | "incorrect" | "neutral";
        originalComment?: InlineComment;
    }[];
}

export type PullRequest = ExerciseRow & {
    exercise_files: DiffFile[];
    feedback?: ReviewFeedback;
    discussions?: Discussion[];
    solutions?: Solution[];
};

export type InlineComment = ReviewCommentRow & {
    profiles: Pick<ProfileRow, "username" | "full_name" | "avatar_url" | "github_url"> | null;
    author?: { name: string; avatar: string; githubUrl?: string };
};

export type SolutionReply = SolutionReplyRow & {
    profiles: Pick<ProfileRow, "username" | "full_name" | "avatar_url" | "github_url"> | null;
    author?: { name: string; avatar: string; githubUrl?: string };
};

export type Solution = SolutionRowDB & {
    profiles: Pick<ProfileRow, "username" | "full_name" | "avatar_url" | "github_url"> | null;
    upvotes: number;
    hasUpvoted?: boolean;
    replyCount: number;
    replies?: SolutionReply[];
    author?: { name: string; avatar: string; githubUrl?: string };
};
