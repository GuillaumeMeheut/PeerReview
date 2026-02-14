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
}

export interface ExpectedIssue {
    title: string;
    description: string;
    severity: Severity;
    line?: string;
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
}
