"use client";

import { useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { User, Pencil, Trash2 } from "lucide-react";
import type { InlineComment, Severity } from "@/lib/types";

interface InlineCommentEditorProps {
    onSubmit: (text: string, severity: Severity) => void;
    onCancel: () => void;
    initialText?: string;
    initialSeverity?: Severity;
}

export function InlineCommentEditor({
    onSubmit,
    onCancel,
    initialText = "",
    initialSeverity = "suggestion",
}: InlineCommentEditorProps) {
    const [text, setText] = useState(initialText);
    const [severity, setSeverity] = useState<Severity>(initialSeverity);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text.trim(), severity);
        setText("");
    };

    return (
        <div className="bg-card/80 border border-border/50 rounded-md p-3 mx-4 my-2">
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Leave a review comment..."
                className="min-h-[80px] bg-background/50 border-border/50 text-sm resize-none focus-visible:ring-1 focus-visible:ring-ring/50"
                autoFocus
            />
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                    {(["critical", "suggestion", "nitpick"] as Severity[]).map((s) => (
                        <Button
                            key={s}
                            variant="ghost"
                            size="sm"
                            onClick={() => setSeverity(s)}
                            className={`h-auto px-2 py-0.5 text-[10px] font-medium border ${severity === s
                                ? s === "critical"
                                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                                    : s === "suggestion"
                                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50"
                                }`}
                        >
                            {s}
                        </Button>
                    ))}
                </div>
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
    onEdit?: (text: string, severity: Severity) => void;
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
                onSubmit={(text, severity) => {
                    onEdit?.(text, severity);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
                initialText={comment.text}
                initialSeverity={comment.severity as Severity}
            />
        );
    }

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
                    <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 ${comment.severity === "critical"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : comment.severity === "suggestion"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}
                    >
                        {comment.severity}
                    </Badge>
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
