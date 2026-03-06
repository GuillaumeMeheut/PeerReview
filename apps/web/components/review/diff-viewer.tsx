"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Highlight, themes } from "prism-react-renderer";
import {
    InlineCommentEditor,
    InlineCommentThread,
} from "./inline-comment";
import type { DiffFile, InlineComment } from "@/lib/types";
import { getLanguageFromFilename } from "@/lib/utils";

interface DiffViewerProps {
    files: DiffFile[];
    comments: Map<string, InlineComment>;
    onAddComment?: (
        file_id: string,
        line_start: number,
        line_end: number,
        text: string
    ) => void;
    onEditComment?: (commentKey: string, newText: string) => void;
    onDeleteComment?: (commentKey: string) => void;
    fileRefs: React.RefObject<Map<number, HTMLDivElement | null>>;
    readOnly?: boolean;
}

// Drag state scoped to a specific file
interface DragState {
    fileId: string;
    chunkIndex: number;
    startLine: number;
    endLine: number;
}

export function DiffViewer({
    files,
    comments,
    onAddComment,
    onEditComment,
    onDeleteComment,
    fileRefs,
    readOnly = false,
}: DiffViewerProps) {
    const [collapsedFiles, setCollapsedFiles] = useState<Set<number>>(new Set());
    const [activeEditor, setActiveEditor] = useState<string | null>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);

    // Track whether a drag is in progress via ref for the mouseup listener
    const dragRef = useRef<DragState | null>(null);

    const toggleFile = (index: number) => {
        setCollapsedFiles((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const handleAddComment = (
        file_id: string,
        line_start: number,
        line_end: number,
        text: string
    ) => {
        onAddComment?.(file_id, line_start, line_end, text);
        setActiveEditor(null);
    };

    const setFileRef = useCallback(
        (index: number, el: HTMLDivElement | null) => {
            fileRefs.current.set(index, el);
        },
        [fileRefs]
    );

    // --- Drag selection handlers ---

    const handleDragStart = useCallback(
        (fileId: string, chunkIndex: number, lineIndex: number) => {
            if (readOnly) return;
            const state: DragState = {
                fileId,
                chunkIndex,
                startLine: lineIndex,
                endLine: lineIndex,
            };
            dragRef.current = state;
            setDragState(state);
        },
        [readOnly]
    );

    const handleDragEnter = useCallback(
        (fileId: string, chunkIndex: number, lineIndex: number) => {
            if (!dragRef.current) return;
            // Only allow drag within the same file and chunk
            if (dragRef.current.fileId !== fileId || dragRef.current.chunkIndex !== chunkIndex) return;
            const updated: DragState = {
                ...dragRef.current,
                endLine: lineIndex,
            };
            dragRef.current = updated;
            setDragState(updated);
        },
        []
    );

    // Global mouseup to finalize drag
    useEffect(() => {
        const handleMouseUp = () => {
            const drag = dragRef.current;
            if (!drag) return;

            const start = Math.min(drag.startLine, drag.endLine);
            const end = Math.max(drag.startLine, drag.endLine);
            const editorKey = `${drag.fileId}-${drag.chunkIndex}-${start}-${end}`;

            dragRef.current = null;
            setDragState(null);
            setActiveEditor(editorKey);
        };

        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    // --- Performance Optimizations ---
    // Pre-calculate editor state once per render instead of per-line
    const parsedActiveEditor = React.useMemo(() => {
        if (!activeEditor) return null;
        const parts = activeEditor.split("-");
        if (parts.length >= 4) {
            return {
                fileId: parts.slice(0, -3).join("-"),
                chunkIndex: parseInt(parts[parts.length - 3]!),
                start: parseInt(parts[parts.length - 2]!),
                end: parseInt(parts[parts.length - 1]!),
            };
        }
        return null;
    }, [activeEditor]);

    // Pre-calculate comment lookup maps
    const { commentsByEndingLine, linesInCommentRange } = React.useMemo(() => {
        const endingMap = new Map<string, { key: string; comment: InlineComment }>();
        const inRangeMap = new Set<string>();

        for (const [key, comment] of comments.entries()) {
            const parts = key.split("-");
            if (parts.length >= 4) {
                const fileId = parts.slice(0, -3).join("-");
                const start = parseInt(parts[parts.length - 2]!);
                const end = parseInt(parts[parts.length - 1]!);

                // Track ending line for the thread UI
                endingMap.set(`${fileId}-${end}`, { key, comment });

                // Track every line that falls in this comment block for highlighting
                for (let i = start; i <= end; i++) {
                    inRangeMap.add(`${fileId}-${i}`);
                }
            }
        }

        return { commentsByEndingLine: endingMap, linesInCommentRange: inRangeMap };
    }, [comments]);

    return (
        <div className="space-y-4">
            {files.map((file, fileIndex) => {
                const isCollapsed = collapsedFiles.has(fileIndex);
                const parts = file.path.split("/");
                const fileName = parts.pop();
                const dirPath = parts.join("/");

                const language = getLanguageFromFilename(fileName);

                return (
                    <div
                        key={file.path}
                        ref={(el) => setFileRef(fileIndex, el)}
                        className="border border-border/50 rounded-lg overflow-hidden bg-card/20"
                    >
                        {/* File header */}
                        <Button
                            variant="ghost"
                            onClick={() => toggleFile(fileIndex)}
                            className="w-full justify-start h-auto flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b border-border/30 hover:bg-muted/30 rounded-none"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span
                                className="text-xs font-mono"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {dirPath && (
                                    <span className="text-muted-foreground/60">{dirPath}/</span>
                                )}
                                <span className="font-medium">{fileName}</span>
                            </span>
                            <div className="flex items-center gap-2 ml-auto text-[10px] font-mono">
                                <span className="text-emerald-400">+{file.additions}</span>
                                <span className="text-red-400">-{file.deletions}</span>
                            </div>
                        </Button>

                        {/* Diff content */}
                        {!isCollapsed && (
                            <div className="overflow-x-auto">
                                {file.file_chunks.map((chunk, chunkIndex) => (
                                    <div key={chunkIndex}>
                                        {/* Chunk header */}
                                        <div
                                            className="px-4 py-1.5 bg-blue-500/5 text-blue-400 text-xs font-mono border-b border-border/20"
                                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                        >
                                            {chunk.header}
                                        </div>

                                        {/* Lines */}
                                        {chunk.lines.map((line, lineIndex) => {
                                            const lineKey = `${file.id}-${chunkIndex}-${lineIndex}`;
                                            const isHovered = false; // Leftover variable, replaced by CSS group-hover

                                            // Boolean checks
                                            const isFileAndChunkMatch = dragState?.fileId === file.id && dragState?.chunkIndex === chunkIndex;
                                            const inDragRange = isFileAndChunkMatch && dragState !== null && lineIndex >= Math.min(dragState.startLine, dragState.endLine) && lineIndex <= Math.max(dragState.startLine, dragState.endLine);

                                            // O(1) lookups
                                            const inCommentRange = linesInCommentRange.has(`${file.id}-${lineIndex}`);
                                            const commentEntry = commentsByEndingLine.get(`${file.id}-${lineIndex}`);

                                            // Check if the editor should open after this line
                                            const isEditorOpen = parsedActiveEditor?.fileId === file.id
                                                && parsedActiveEditor?.chunkIndex === chunkIndex
                                                && parsedActiveEditor?.end === lineIndex;

                                            const editorStart = parsedActiveEditor ? parsedActiveEditor.start : 0;
                                            const editorEnd = parsedActiveEditor ? parsedActiveEditor.end : 0;

                                            // Check if this line is in the active editor's selected range
                                            const isInActiveEditorRange = parsedActiveEditor?.fileId === file.id
                                                && parsedActiveEditor?.chunkIndex === chunkIndex
                                                && lineIndex >= parsedActiveEditor.start
                                                && lineIndex <= parsedActiveEditor.end;

                                            // Should show the "+" button?
                                            // Using group-hover inside className instead of React state for hover
                                            const isOccupied = inCommentRange || isEditorOpen || !!commentEntry;

                                            return (
                                                <div key={lineKey}>
                                                    <div
                                                        className={cn(
                                                            "flex items-stretch text-xs font-mono group relative",
                                                            line.type === "added" &&
                                                            "bg-emerald-500/8 hover:bg-emerald-500/12",
                                                            line.type === "removed" &&
                                                            "bg-red-500/8 hover:bg-red-500/12",
                                                            line.type === "unchanged" && "hover:bg-muted/20",
                                                            (inDragRange || isInActiveEditorRange) && "!bg-blue-500/15",
                                                            inCommentRange && !inDragRange && !isInActiveEditorRange && "!bg-blue-500/5"
                                                        )}
                                                        style={{
                                                            fontFamily: "'JetBrains Mono', monospace",
                                                            userSelect: dragState ? "none" : undefined,
                                                        }}
                                                        onMouseEnter={() => {
                                                            handleDragEnter(file.id, chunkIndex, lineIndex);
                                                        }}
                                                    >
                                                        {/* Add comment button / drag handle */}
                                                        <div className="w-8 flex items-center justify-center shrink-0 relative opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                            {!readOnly && !isOccupied && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        handleDragStart(file.id, chunkIndex, lineIndex);
                                                                    }}
                                                                    onClick={(e) => {
                                                                        // Single click fallback (no drag)
                                                                        e.preventDefault();
                                                                    }}
                                                                    className="absolute inset-0 h-full w-full rounded-none text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 z-10 transition-colors"
                                                                    title="Click and drag to select lines"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* Old line number */}
                                                        <div
                                                            className={cn(
                                                                "w-12 text-right pr-2 py-0.5 text-muted-foreground/40 select-none shrink-0 border-r",
                                                                line.type === "added"
                                                                    ? "border-r-emerald-500/15"
                                                                    : line.type === "removed"
                                                                        ? "border-r-red-500/15"
                                                                        : "border-r-border/20"
                                                            )}
                                                        >
                                                            {line.oldLineNumber ?? ""}
                                                        </div>

                                                        {/* New line number */}
                                                        <div
                                                            className={cn(
                                                                "w-12 text-right pr-2 py-0.5 text-muted-foreground/40 select-none shrink-0 border-r",
                                                                line.type === "added"
                                                                    ? "border-r-emerald-500/15"
                                                                    : line.type === "removed"
                                                                        ? "border-r-red-500/15"
                                                                        : "border-r-border/20"
                                                            )}
                                                        >
                                                            {line.newLineNumber ?? ""}
                                                        </div>

                                                        {/* Line type indicator */}
                                                        <div
                                                            className={cn(
                                                                "w-6 text-center py-0.5 select-none shrink-0",
                                                                line.type === "added" && "text-emerald-400",
                                                                line.type === "removed" && "text-red-400"
                                                            )}
                                                        >
                                                            {line.type === "added"
                                                                ? "+"
                                                                : line.type === "removed"
                                                                    ? "-"
                                                                    : " "}
                                                        </div>

                                                        {/* Code content */}
                                                        <div className="flex-1 py-0.5 pr-4 whitespace-pre overflow-x-auto">
                                                            <Highlight
                                                                theme={themes.vsDark}
                                                                code={line.content || " "}
                                                                language={language}
                                                            >
                                                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                                                    <span style={{ ...style, backgroundColor: "transparent" }}>
                                                                        {tokens.map((line, i) => (
                                                                            <span key={i} {...getLineProps({ line })}>
                                                                                {line.map((token, key) => (
                                                                                    <span key={key} {...getTokenProps({ token })} />
                                                                                ))}
                                                                            </span>
                                                                        ))}
                                                                    </span>
                                                                )}
                                                            </Highlight>
                                                        </div>
                                                    </div>

                                                    {/* Inline comment editor (appears after last selected line) */}
                                                    {!readOnly && isEditorOpen && (
                                                        <InlineCommentEditor
                                                            lineRange={editorStart !== editorEnd ? { start: editorStart, end: editorEnd } : undefined}
                                                            onSubmit={(text) =>
                                                                handleAddComment(
                                                                    file.id,
                                                                    editorStart,
                                                                    editorEnd,
                                                                    text
                                                                )
                                                            }
                                                            onCancel={() => setActiveEditor(null)}
                                                        />
                                                    )}

                                                    {/* Inline comment thread */}
                                                    {commentEntry && (
                                                        <InlineCommentThread
                                                            comment={commentEntry.comment}
                                                            onEdit={onEditComment ? (text: string) => onEditComment(commentEntry.key, text) : undefined}
                                                            onDelete={onDeleteComment ? () => onDeleteComment(commentEntry.key) : undefined}
                                                            readOnly={readOnly}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
