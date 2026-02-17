
"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Badge } from "@workspace/ui/components/badge";
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    BarChart3,
    Trophy
} from "lucide-react";
import { InlineComment } from "@/lib/types";

import { Gauge } from "@workspace/ui/components/gauge";

interface AIFeedbackProps {
    prId: string;
}

interface FeedbackMetrics {
    technical_accuracy: number;
    communication_style: number;
    constructiveness: number;
    completeness: number;
}

interface StructuredFeedback {
    summary: string;
    strengths: string[];
    improvements: string[];
    metrics: FeedbackMetrics;
    overallScore: number;
}

export function AIFeedback({ prId }: AIFeedbackProps) {
    const [comments, setComments] = useState<[string, InlineComment][]>([]);
    const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
    const [feedback, setFeedback] = useState<StructuredFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(`review-comments-${prId}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setComments(parsed);
                }
            } catch (e) {
                console.error("Failed to parse stored comments", e);
            }
        }
        setHasCheckedStorage(true);
    }, [prId]);

    const handleGenerate = async () => {
        if (comments.length === 0) {
            console.error("No comments found to analyze.");
            return;
        }

        setIsLoading(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/review/feedback", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comments,
                    prId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate feedback");
            }

            const data = await response.json() as StructuredFeedback;
            setFeedback(data);
        } catch (err) {
            // @ts-expect-error err is unknown
            console.error("Failed to generate AI feedback: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!hasCheckedStorage) return null;

    if (comments.length === 0 && !isLoading && !feedback) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground bg-muted/20">
                <p>Submit a review with comments to get AI feedback.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        AI Review Coach
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Get personalized coaching on your code review skills.
                    </p>
                </div>
                {!feedback && !isLoading && (
                    <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze My Review
                    </Button>
                )}
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 border rounded-lg bg-card/50">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <div className="text-center space-y-1">
                        <p className="font-medium">Analyzing your review...</p>
                        <p className="text-xs text-muted-foreground">Evaluating tone, accuracy, and constructive feedback</p>
                    </div>
                </div>
            )}

            {feedback && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Overall Score Card */}
                    <Card className="border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-card">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="shrink-0">
                                    <Gauge value={feedback.overallScore} size="lg" className="w-40 h-40" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Review Summary</h4>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feedback.summary}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Gauge
                                            value={feedback.metrics.technical_accuracy}
                                            label="Accuracy"
                                            size="sm"
                                        />
                                        <Gauge
                                            value={feedback.metrics.communication_style}
                                            label="Communication"
                                            size="sm"
                                        />
                                        <Gauge
                                            value={feedback.metrics.constructiveness}
                                            label="Constructive"
                                            size="sm"
                                        />
                                        <Gauge
                                            value={feedback.metrics.completeness}
                                            label="Completeness"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <Trophy className="h-5 w-5" />
                                    Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {feedback.strengths.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Improvements */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <BarChart3 className="h-5 w-5" />
                                    Areas for Improvement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {feedback.improvements.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline" onClick={handleGenerate} className="text-muted-foreground">
                            Regenerate Analysis
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
