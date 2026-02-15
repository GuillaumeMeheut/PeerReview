import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";

interface DiscussionFormProps {
    onSubmit: (content: string) => Promise<void> | void;
    onCancel: () => void;
    submitLabel?: string;
    placeholder?: string;
    initialContent?: string;
    autoFocus?: boolean;
}

export function DiscussionForm({
    onSubmit,
    onCancel,
    submitLabel = "Comment",
    placeholder = "Write a comment...",
    initialContent = "",
    autoFocus = true,
}: DiscussionFormProps) {
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-top-2">
            <Textarea
                placeholder={placeholder}
                className="min-h-[80px] mb-2 resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                autoFocus={autoFocus}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSubmit();
                    }
                }}
            />
            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? "Posting..." : submitLabel}
                </Button>
            </div>
        </div>
    );
}
