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

export interface DiffChunk {
    header: string;
    lines: DiffLine[];
}

export interface DiffFile {
    path: string;
    chunks: DiffChunk[];
    additions: number;
    deletions: number;
}

export interface InlineComment {
    id: string;
    fileIndex: number;
    lineIndex: number;
    text: string;
    severity: Severity;
    timestamp: number;
    author?: {
        name: string;
        avatar: string;
    };
}

export interface ExpectedIssue {
    title: string;
    description: string;
    severity: Severity;
    line?: string;
}

export interface DiscussionReply {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: number;
}

export interface Discussion {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    timestamp: number;
    upvotes: number;
    replyCount: number;
    replies: DiscussionReply[];
}

export interface ReviewFeedback {
    score: number;
    expectedIssues: ExpectedIssue[];
    commonlyMissed: string[];
    seniorExample: string;
}

export interface PullRequest {
    id: string;
    title: string;
    description: string;
    difficulty: Difficulty;
    techStack: string[];
    tags: Tag[];
    author: string;
    baseBranch: string;
    headBranch: string;
    files: DiffFile[];
    feedback: ReviewFeedback;
    discussions?: Discussion[];
    solutions?: Solution[];
}

export interface Solution {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    description: string;
    upvotes: number;
    comments: InlineComment[];
    timestamp: number;
}
