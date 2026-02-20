"use client";

import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, GitPullRequest } from "lucide-react";
import type { PullRequest } from "@/lib/types";

const difficultyColors: Record<string, string> = {
    Junior:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    Mid: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    Senior:
        "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
};

export function PRCard({ pr }: { pr: PullRequest }) {
    const totalAdditions = pr.exercise_files.reduce((sum, f) => sum + f.additions, 0);
    const totalDeletions = pr.exercise_files.reduce((sum, f) => sum + f.deletions, 0);

    return (
        <Link href={`/review/${pr.id}`} className="block group">
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/80 hover:shadow-lg hover:shadow-black/5">
                <CardHeader className="grid grid-cols-[16px_1fr] items-center gap-2.5">
                    <GitPullRequest className="h-4 w-4 text-muted-foreground shrink-0" />
                    <CardTitle className="text-sm font-medium leading-tight  cursor-default min-w-0">
                        {pr.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6">
                        {pr.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge
                            variant="outline"
                            className={`shrink-0 text-xs font-medium px-2 py-0.5 border-0 ${difficultyColors[pr.difficulty]}`}
                        >
                            {pr.difficulty}
                        </Badge>
                        <span className="flex items-center gap-1">
                            <span className="text-emerald-400">+{totalAdditions}</span>
                            <span className="text-red-400">-{totalDeletions}</span>
                        </span>
                        <span>{pr.exercise_files.length} files</span>
                        <span className="text-muted-foreground/60">by {pr.author}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {pr.tech_stack.map((tech) => (
                            <Badge
                                key={tech}
                                variant="secondary"
                                className="text-[10px] font-medium px-1.5 py-0 h-5 bg-secondary/50"
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {pr.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[10px] text-muted-foreground/70 border border-border/50 rounded px-1.5 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="pt-0">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Review PR
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
