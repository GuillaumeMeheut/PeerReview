"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@workspace/ui/components/button";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
    InlineCommentEditor,
    InlineCommentThread,
} from "./inline-comment";
import type { DiffFile, InlineComment, Severity } from "@/lib/types";

// Basic syntax highlighting for TypeScript/JavaScript
function highlightSyntax(content: string): React.ReactNode {
    if (!content.trim()) return content;

    const keywords =
        /\b(import|export|from|const|let|var|function|return|if|else|try|catch|finally|throw|new|class|interface|type|extends|implements|async|await|for|while|do|switch|case|break|continue|default|typeof|instanceof|in|of|void|null|undefined|true|false|this|super)\b/g;
    const strings = /(["'`])(?:(?!\1|\\).|\\.)*\1/g;
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    const numbers = /\b(\d+\.?\d*)\b/g;
    const types = /\b([A-Z][a-zA-Z0-9]*(?:<[^>]+>)?)\b/g;

    // Build tokens with positions
    type Token = { start: number; end: number; type: string; text: string };
    const tokens: Token[] = [];

    let match: RegExpExecArray | null;

    // Comments first (highest priority)
    const commentRegex = new RegExp(comments.source, comments.flags);
    while ((match = commentRegex.exec(content)) !== null) {
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "comment",
            text: match[0],
        });
    }

    // Strings
    const stringRegex = new RegExp(strings.source, strings.flags);
    while ((match = stringRegex.exec(content)) !== null) {
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "string",
            text: match[0],
        });
    }

    // Keywords
    const keywordRegex = new RegExp(keywords.source, keywords.flags);
    while ((match = keywordRegex.exec(content)) !== null) {
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "keyword",
            text: match[0],
        });
    }

    // Types
    const typeRegex = new RegExp(types.source, types.flags);
    while ((match = typeRegex.exec(content)) !== null) {
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "type",
            text: match[0],
        });
    }

    // Numbers
    const numberRegex = new RegExp(numbers.source, numbers.flags);
    while ((match = numberRegex.exec(content)) !== null) {
        tokens.push({
            start: match.index,
            end: match.index + match[0].length,
            type: "number",
            text: match[0],
        });
    }

    // Remove overlapping tokens (higher priority wins)
    tokens.sort((a, b) => a.start - b.start);
    const filtered: Token[] = [];
    let lastEnd = 0;
    for (const token of tokens) {
        if (token.start >= lastEnd) {
            filtered.push(token);
            lastEnd = token.end;
        }
    }

    // Build result
    const result: React.ReactNode[] = [];
    let pos = 0;

    for (const token of filtered) {
        if (token.start > pos) {
            result.push(content.slice(pos, token.start));
        }

        const colorClass =
            token.type === "keyword"
                ? "text-purple-400"
                : token.type === "string"
                    ? "text-emerald-400"
                    : token.type === "comment"
                        ? "text-muted-foreground/60 italic"
                        : token.type === "type"
                            ? "text-amber-300"
                            : token.type === "number"
                                ? "text-blue-400"
                                : "";

        result.push(
            <span key={`${token.start}-${token.type}`} className={colorClass}>
                {token.text}
            </span>
        );
        pos = token.end;
    }

    if (pos < content.length) {
        result.push(content.slice(pos));
    }

    return result;
}

interface DiffViewerProps {
    files: DiffFile[];
    comments: Map<string, InlineComment>;
    onAddComment?: (
        fileIndex: number,
        lineIndex: number,
        text: string,
        severity: Severity
    ) => void;
    onEditComment?: (commentKey: string, newText: string, newSeverity: Severity) => void;
    onDeleteComment?: (commentKey: string) => void;
    fileRefs: React.MutableRefObject<Map<number, HTMLDivElement | null>>;
    readOnly?: boolean;
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
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

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
        fileIndex: number,
        lineIndex: number,
        text: string,
        severity: Severity
    ) => {
        onAddComment?.(fileIndex, lineIndex, text, severity);
        setActiveEditor(null);
    };

    const setFileRef = useCallback(
        (index: number, el: HTMLDivElement | null) => {
            fileRefs.current.set(index, el);
        },
        [fileRefs]
    );

    return (
        <div className="space-y-4">
            {files.map((file, fileIndex) => {
                const isCollapsed = collapsedFiles.has(fileIndex);
                const parts = file.path.split("/");
                const fileName = parts.pop();
                const dirPath = parts.join("/");

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
                                {file.chunks.map((chunk, chunkIndex) => (
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
                                            const lineKey = `${fileIndex}-${chunkIndex}-${lineIndex}`;
                                            const commentKey = `${fileIndex}-${chunkIndex}-${lineIndex}`;
                                            const comment = comments.get(commentKey);
                                            const isEditorOpen = activeEditor === lineKey;
                                            const isHovered = hoveredLine === lineKey;

                                            return (
                                                <div key={lineKey}>
                                                    <div
                                                        className={cn(
                                                            "flex items-stretch text-xs font-mono group relative",
                                                            line.type === "added" &&
                                                            "bg-emerald-500/8 hover:bg-emerald-500/12",
                                                            line.type === "removed" &&
                                                            "bg-red-500/8 hover:bg-red-500/12",
                                                            line.type === "unchanged" && "hover:bg-muted/20"
                                                        )}
                                                        style={{
                                                            fontFamily: "'JetBrains Mono', monospace",
                                                        }}
                                                        onMouseEnter={() => setHoveredLine(lineKey)}
                                                        onMouseLeave={() => setHoveredLine(null)}
                                                    >
                                                        {/* Add comment button */}
                                                        <div className="w-8 flex items-center justify-center shrink-0 relative">
                                                            {!readOnly && isHovered && !comment && !isEditorOpen && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setActiveEditor(lineKey)}
                                                                    className="absolute inset-0 h-auto w-auto text-blue-400 hover:text-blue-300 hover:bg-transparent z-10"
                                                                    title="Add comment"
                                                                >
                                                                    <Plus className="h-3.5 w-3.5" />
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
                                                            {highlightSyntax(line.content)}
                                                        </div>
                                                    </div>

                                                    {/* Inline comment editor */}
                                                    {!readOnly && isEditorOpen && (
                                                        <InlineCommentEditor
                                                            onSubmit={(text, severity) =>
                                                                handleAddComment(
                                                                    fileIndex,
                                                                    lineIndex,
                                                                    text,
                                                                    severity
                                                                )
                                                            }
                                                            onCancel={() => setActiveEditor(null)}
                                                        />
                                                    )}

                                                    {/* Inline comment thread */}
                                                    {comment && (
                                                        <InlineCommentThread
                                                            comment={comment}
                                                            onEdit={onEditComment ? (text: string, severity: Severity) => onEditComment(commentKey, text, severity) : undefined}
                                                            onDelete={onDeleteComment ? () => onDeleteComment(commentKey) : undefined}
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
