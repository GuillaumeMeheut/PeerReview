import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { MessageSquare } from "lucide-react";
import { DiscussionForm } from "./discussion-form";

interface NewDiscussionFormProps {
    onAddDiscussion: (content: string) => void;
}

export function NewDiscussionForm({ onAddDiscussion }: NewDiscussionFormProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (content: string) => {
        onAddDiscussion(content);
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <div className="p-4 border rounded-lg border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground h-auto p-0 font-normal"
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        <span className="text-sm">Start a new discussion...</span>
                    </div>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-lg border-border bg-card animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-medium mb-3">New Discussion</h3>
            <DiscussionForm
                onSubmit={handleSubmit}
                onCancel={() => setIsExpanded(false)}
                submitLabel="Start Discussion"
                placeholder="What would you like to discuss?"
            />
        </div>
    );
}
