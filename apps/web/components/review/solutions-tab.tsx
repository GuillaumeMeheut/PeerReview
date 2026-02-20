import { Solution } from "@/lib/types";
import { SolutionRow } from "./solution-row";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Lock } from "lucide-react";

export function SolutionsTab({ prId, solutions }: { prId: string; solutions: Solution[] }) {

    const listContent = solutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Lock className="h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm font-medium">No solutions yet</p>
            <p className="text-xs mt-1 opacity-60">
                Be the first to share your solution!
            </p>
        </div>
    ) : (
        <div className="space-y-4">
            {solutions.map((solution) => (
                <SolutionRow
                    key={solution.id}
                    solution={solution}
                    prId={prId}
                />
            ))}
        </div>
    );

    return (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6 max-w-3xl mx-auto py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Community Solutions</h3>
                    <span className="text-xs text-muted-foreground">
                        {solutions.length} solution{solutions.length !== 1 ? "s" : ""}
                    </span>
                </div>
                {listContent}
            </div>
        </ScrollArea>
    );
}
