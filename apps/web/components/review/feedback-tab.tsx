"use client";

import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Target,
    TrendingUp,
    Quote,
    ArrowRight,
} from "lucide-react";
import type { ReviewFeedback, PullRequest, ExpectedIssue } from "@/lib/types";

interface FeedbackTabProps {
    feedback: ReviewFeedback;
    pr: PullRequest;
}

export function FeedbackTab({ feedback, pr }: FeedbackTabProps) {
    const scoreColor =
        feedback.overall_score >= 80
            ? "text-emerald-400"
            : feedback.overall_score >= 60
                ? "text-amber-400"
                : "text-red-400";

    const scoreRingColor =
        feedback.overall_score >= 80
            ? "stroke-emerald-400"
            : feedback.overall_score >= 60
                ? "stroke-amber-400"
                : "stroke-red-400";

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (feedback.overall_score / 100) * circumference;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Score */}
            <div className="flex items-center justify-center pt-4">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/30"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className={scoreRingColor}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold tabular-nums ${scoreColor}`}>
                            {feedback.overall_score}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                            / 100
                        </span>
                    </div>
                </div>
            </div>

            <Separator className="bg-border/30" />

            {/* Expected Issues */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Key issues you were expected to catch
                    </h2>
                </div>
                <div className="space-y-3">
                    {feedback.expected_issues?.map((issue: any, i: number) => (
                        <div
                            key={i}
                            className="border border-border/50 rounded-lg p-4 bg-card/30"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    {issue.severity === "critical" ? (
                                        <XCircle className="h-4 w-4 text-red-400" />
                                    ) : issue.severity === "suggestion" ? (
                                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-sm font-medium">{issue.title}</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] px-1.5 py-0 h-4 ${issue.severity === "critical"
                                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                : issue.severity === "suggestion"
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                }`}
                                        >
                                            {issue.severity}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {issue.description}
                                    </p>
                                    {issue.line && (
                                        <div
                                            className="mt-2 px-3 py-1.5 bg-muted/20 border border-border/30 rounded font-mono text-[11px] text-muted-foreground overflow-x-auto"
                                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                        >
                                            {issue.line}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Separator className="bg-border/30" />

            {/* Commonly Missed */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Common things reviewers miss
                    </h2>
                </div>
                <div className="space-y-2">
                    {pr.commonly_missed.map((item: string, i: number) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 px-4 py-3 bg-card/20 border border-border/30 rounded-lg"
                        >
                            <span className="text-xs text-muted-foreground/50 font-mono mt-0.5">
                                {i + 1}.
                            </span>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Separator className="bg-border/30" />

            {/* Senior Example */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Quote className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Example of a strong senior-level review
                    </h2>
                </div>
                <div className="border border-border/50 rounded-lg bg-card/30 p-5">
                    <div className="prose prose-sm prose-invert max-w-none">
                        {pr.senior_example.split("\n\n").map((paragraph: string, i: number) => (
                            <p
                                key={i}
                                className="text-sm text-foreground/80 leading-relaxed mb-3 last:mb-0"
                            >
                                {paragraph.split(/(\*\*[^*]+\*\*)/).map((part: string, j: number) => {
                                    if (part.startsWith("**") && part.endsWith("**")) {
                                        return (
                                            <strong key={j} className="text-foreground font-semibold">
                                                {part.slice(2, -2)}
                                            </strong>
                                        );
                                    }
                                    if (part.startsWith("`") && part.endsWith("`")) {
                                        return (
                                            <code
                                                key={j}
                                                className="px-1 py-0.5 bg-muted/30 rounded text-xs font-mono"
                                            >
                                                {part.slice(1, -1)}
                                            </code>
                                        );
                                    }
                                    return part;
                                })}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            <div className="flex justify-center pb-4">
                <Link
                    href="/problems"
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors"
                >
                    Review another PR
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
