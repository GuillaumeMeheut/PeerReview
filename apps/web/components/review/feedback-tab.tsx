import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Target,
    TrendingUp,
    ArrowRight,
} from "lucide-react";
import type { ReviewFeedback, PullRequest } from "@/lib/types";

interface FeedbackTabProps {
    feedback: ReviewFeedback;
    pr: PullRequest;
}

export function FeedbackTab({ feedback, pr }: FeedbackTabProps) {

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Expected Issues */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Key issues you were expected to catch
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {feedback.expected_issues?.map((issue: any, i: number) => (
                        <Card
                            key={i}
                            className="flex flex-col border-border/50 bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-200"
                        >
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        {issue.severity === "critical" ? (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        ) : issue.severity === "suggestion" ? (
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                        )}
                                        <CardTitle className="text-sm font-medium line-clamp-1" title={issue.title}>
                                            {issue.title}
                                        </CardTitle>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1.5 py-0 h-5 border shrink-0 ${issue.severity === "critical"
                                            ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                                            : issue.severity === "suggestion"
                                                ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                                                : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                                            }`}
                                    >
                                        {issue.severity}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                    {issue.description}
                                </p>
                                {issue.line && (
                                    <div
                                        className="mt-auto px-3 py-2 bg-muted/40 border border-border/40 rounded-md font-mono text-[11px] text-muted-foreground overflow-x-auto truncate"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                        title={issue.line}
                                    >
                                        {issue.line}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
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
                <div className="space-y-3">
                    {pr.commonly_missed.map((item: string, i: number) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 px-4 py-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary mt-0.5 ring-1 ring-primary/20">
                                {i + 1}
                            </div>
                            <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Separator className="bg-border/30" />
            <div className="flex justify-center pb-4">
                <Link
                    href="/explore"
                    className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 transition-colors"
                >
                    Review another PR
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
