import { ArrowBigUp, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import type { Solution } from "@/lib/types";

interface SolutionRowProps {
    solution: Solution;
    onSelect: (id: string) => void;
}

export function SolutionRow({ solution, onSelect }: SolutionRowProps) {
    return (
        <div className="flex gap-4 p-4 border rounded-lg border-border/50 bg-card hover:border-border transition-colors">
            {/* Upvote Column */}
            <div className="flex flex-col items-center gap-1 min-w-[32px]">
                <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                    <ArrowBigUp className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                    {solution.upvotes}
                </span>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={solution.author.avatar} />
                        <AvatarFallback>{solution.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                        {solution.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(solution.timestamp, { addSuffix: true })}
                    </span>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90">
                    {solution.description}
                </p>

                <div className="pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onSelect(solution.id)}
                    >
                        <ExternalLink className="h-4 w-4" />
                        See Solution
                    </Button>
                </div>
            </div>
        </div>
    );
}
