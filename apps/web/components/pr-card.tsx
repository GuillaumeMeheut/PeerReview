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
import posthog from "posthog-js";

const difficultyColors: Record<string, string> = {
    Junior:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    Mid: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
    Senior:
        "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
};

const cardHoverStyles: Record<string, string> = {
    Junior: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    Mid: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    Senior: "hover:border-red-500/40 hover:shadow-red-500/10",
};

const topAccentColors: Record<string, string> = {
    Junior: "bg-emerald-500/50 group-hover:bg-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.4)]",
    Mid: "bg-amber-500/50 group-hover:bg-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    Senior: "bg-red-500/50 group-hover:bg-red-400 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.4)]",
};

const iconColors: Record<string, string> = {
    Junior: "text-emerald-500/70 group-hover:text-emerald-400",
    Mid: "text-amber-500/70 group-hover:text-amber-400",
    Senior: "text-red-500/70 group-hover:text-red-400",
};

export function PRCard({ pr }: { pr: PullRequest }) {
    const totalAdditions = pr.exercise_files.reduce((sum, f) => sum + f.additions, 0);
    const totalDeletions = pr.exercise_files.reduce((sum, f) => sum + f.deletions, 0);

    const handleReviewStart = () => {
        posthog.capture("review_started", {
            pr_id: pr.id,
            pr_title: pr.title,
            difficulty: pr.difficulty,
            tech_stack: pr.tech_stack,
            tags: pr.tags,
            file_count: pr.exercise_files.length,
            total_additions: totalAdditions,
            total_deletions: totalDeletions,
        });
    };

    return (
        <Link href={`/review/${pr.id}`} className="block group h-full" onClick={handleReviewStart}>
            <Card className={`h-full flex flex-col border-border/50 bg-gradient-to-b from-card/50 to-card/10 backdrop-blur-sm transition-all duration-300 ${cardHoverStyles[pr.difficulty] || 'hover:border-primary/40'} hover:bg-card/80 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}>
                {/* Top Difficulty Accent */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 ${topAccentColors[pr.difficulty] || 'bg-primary/50 group-hover:bg-primary'}`} />

                <CardHeader className="grid grid-cols-[16px_1fr] items-center gap-2.5 pt-4">
                    <GitPullRequest className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconColors[pr.difficulty] || 'text-primary'}`} />
                    <CardTitle className="text-sm font-medium leading-tight cursor-pointer min-w-0 transition-colors duration-200 group-hover:text-foreground">
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
