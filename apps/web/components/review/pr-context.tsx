"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { GitBranch, GitPullRequest, FileCode, User } from "lucide-react";
import type { PullRequest } from "@/lib/types";

export function PRContext({ pr }: { pr: PullRequest }) {
    const totalAdditions = pr.exercise_files.reduce((sum, f) => sum + f.additions, 0);
    const totalDeletions = pr.exercise_files.reduce((sum, f) => sum + f.deletions, 0);

    return (
        <div id="tour-context" className="border border-border/50 rounded-lg bg-card/30">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                        <GitPullRequest className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold leading-tight">
                                {pr.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{pr.author}</span>
                                <span className="text-muted-foreground/40">wants to merge</span>
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                    <GitBranch className="h-3 w-3 text-blue-400" />
                                    <span className="text-blue-400 font-mono text-[11px]">
                                        {pr.head_branch}
                                    </span>
                                </div>
                                <span className="text-muted-foreground/40">into</span>
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 border border-border/50">
                                    <GitBranch className="h-3 w-3" />
                                    <span className="font-mono text-[11px]">{pr.base_branch}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${pr.difficulty === "Junior"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : pr.difficulty === "Mid"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                    >
                        {pr.difficulty}
                    </Badge>
                </div>

                <Separator className="my-4 bg-border/30" />

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {pr.description}
                </p>

                {pr.tech_stack && pr.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {pr.tech_stack.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs font-medium bg-secondary/50">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <FileCode className="h-3.5 w-3.5" />
                        <span>{pr.exercise_files.length} files changed</span>
                    </div>
                    <span className="text-emerald-400 font-mono">+{totalAdditions}</span>
                    <span className="text-red-400 font-mono">-{totalDeletions}</span>
                </div>
            </div>
        </div>
    );
}
