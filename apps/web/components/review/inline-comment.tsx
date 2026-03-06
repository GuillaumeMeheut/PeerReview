"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { User, Pencil, Trash2 } from "lucide-react";
import type { InlineComment } from "@/lib/types";

interface InlineCommentEditorProps {
    onSubmit: (text: string) => void;
    onCancel: () => void;
    initialText?: string;
    lineRange?: { start: number; end: number };
}

export function InlineCommentEditor({
    onSubmit,
    onCancel,
    initialText = "",
    lineRange,
}: InlineCommentEditorProps) {
    const [text, setText] = useState(initialText);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text.trim());
        setText("");
    };

    return (
        <div className="bg-card/80 border border-border/50 rounded-md p-3 mx-4 my-2">
            {lineRange && (
                <div className="mb-2 text-[10px] font-mono text-blue-400">
                    Lines {lineRange.start}–{lineRange.end}
                </div>
            )}
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Leave a review comment..."
                className="min-h-[80px] bg-background/50 border-border/50 text-sm resize-none focus-visible:ring-1 focus-visible:ring-ring/50"
                autoFocus
            />
            <div className="flex items-center justify-end mt-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                    >
                        {initialText ? "Save" : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface InlineCommentThreadProps {
    comment: InlineComment;
    onEdit?: (text: string) => void;
    onDelete?: () => void;
    readOnly?: boolean;
}

export function InlineCommentThread({
    comment,
    onEdit,
    onDelete,
    readOnly = false,
}: InlineCommentThreadProps) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <InlineCommentEditor
                onSubmit={(text) => {
                    onEdit?.(text);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                initialText={comment.text}
            />
        );
    }

    const hasRange = comment.line_end_index !== undefined && comment.line_end_index !== comment.line_index;

    return (
        <div className="border border-border/50 bg-card/60 rounded-md mx-4 my-2">
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-5 w-5">
                        {comment.author ? (
                            <AvatarImage src={comment.author.avatar} />
                        ) : null}
                        <AvatarFallback className="text-[10px] bg-muted">
                            {comment.author ? comment.author.name[0] : <User className="h-3 w-3" />}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                        {comment.author ? comment.author.name : "You"}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 ml-auto">
                        {hasRange ? `Lines ${comment.line_index}–${comment.line_end_index}` : `Line ${comment.line_index}`}
                    </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                    {comment.text}
                </p>
                {!readOnly && (
                    <div className="flex justify-end mt-2 gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="h-auto px-2 py-1 text-[10px] gap-1"
                        >
                            <Pencil className="h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDelete}
                            className="h-auto px-2 py-1 text-[10px] gap-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                        >
                            <Trash2 className="h-3 w-3" />
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
