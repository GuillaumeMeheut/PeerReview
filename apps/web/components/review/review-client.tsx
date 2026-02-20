"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FileTree } from "./file-tree";
import { DiffViewer } from "./diff-viewer";
import { SubmitReview } from "./submit-review";
import type { PullRequest, InlineComment, Severity } from "@/lib/types";

type ReviewClientProps = {
    pr: PullRequest;
    readOnly?: boolean;
    initialComments?: InlineComment[];
};

export function ReviewClient({ pr, readOnly = false, initialComments = [] }: ReviewClientProps) {
    const [comments, setComments] = useState<Map<string, InlineComment>>(() => {
        const map = new Map<string, InlineComment>();
        initialComments.forEach(c => map.set(`${c.file_id}-0-${c.line_index}`, c));
        return map;
    });

    const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
    const fileRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

    // Load comments from local storage on mount
    useEffect(() => {
        if (readOnly) return;
        const stored = localStorage.getItem(`review-comments-${pr.id}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setComments((prev) => {
                        const next = new Map(prev);
                        parsed.forEach(([key, value]) => {
                            next.set(key, value);
                        });
                        return next;
                    });
                }
            } catch (e) {
                console.error("Failed to parse stored comments", e);
            }
        }
    }, [pr.id, readOnly]);

    const saveToLocalStorage = useCallback((newComments: Map<string, InlineComment>) => {
        if (readOnly) return;
        const entries = Array.from(newComments.entries());
        localStorage.setItem(`review-comments-${pr.id}`, JSON.stringify(entries));
    }, [pr.id, readOnly]);

    const handleAddComment = useCallback(
        (file_id: string, line_index: number, text: string, severity: Severity) => {
            if (readOnly) return;
            const key = `${file_id}-0-${line_index}`;
            setComments((prev) => {
                const next = new Map(prev);
                next.set(key, {
                    id: key,
                    file_id,
                    line_index,
                    text,
                    severity,
                    created_at: new Date().toISOString(), // DB uses String for created_at, but we can mock
                    review_id: pr.id,
                    profiles: null,
                });
                saveToLocalStorage(next);
                return next;
            });
        },
        [readOnly, saveToLocalStorage]
    );

    const handleEditComment = useCallback(
        (commentKey: string, newText: string, newSeverity: Severity) => {
            if (readOnly) return;
            setComments((prev) => {
                const next = new Map(prev);
                const comment = next.get(commentKey);
                if (comment) {
                    next.set(commentKey, { ...comment, text: newText, severity: newSeverity });
                }
                saveToLocalStorage(next);
                return next;
            });
        },
        [readOnly, saveToLocalStorage]
    );

    const handleDeleteComment = useCallback((commentKey: string) => {
        if (readOnly) return;
        setComments((prev) => {
            const next = new Map(prev);
            next.delete(commentKey);
            saveToLocalStorage(next);
            return next;
        });
    }, [readOnly, saveToLocalStorage]);

    const handleFileClick = useCallback((index: number) => {
        setActiveFileIndex(index);
        const ref = fileRefs.current.get(index);
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);


    // RENDER
    return (
        <div className="flex gap-4 mt-4">
            {/* Left: File Tree */}
            <div className="w-72 shrink-0">
                <div className="sticky top-20">
                    <FileTree
                        files={pr.exercise_files}
                        activeFileIndex={activeFileIndex}
                        onFileClick={handleFileClick}
                    />
                </div>
            </div>

            {/* Right: Diff Viewer */}
            <div className="flex-1 min-w-0 space-y-6">
                <div className={readOnly ? "pointer-events-none opacity-90" : ""}>
                    <DiffViewer
                        files={pr.exercise_files}
                        comments={comments}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                        fileRefs={fileRefs}
                        readOnly={readOnly}
                    />
                </div>
                {!readOnly && (
                    <SubmitReview
                        comments={comments}
                        files={pr.exercise_files}
                        prId={pr.id}
                    />
                )}
                {readOnly && (
                    <div className="flex items-center justify-center p-8 bg-muted/20 border border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground text-sm">
                            You are viewing a reference solution.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
