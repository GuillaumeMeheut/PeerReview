
"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
    Sparkles,
    Loader2,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    Trophy,
    MessageSquareQuote
} from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { Gauge } from "@workspace/ui/components/gauge";
import { StructuredFeedback } from "@/lib/types";

interface AIFeedbackProps {
    prId: string;
    reviewId: string;
    isLoggedIn: boolean;
    initialFeedback?: StructuredFeedback | null;
}

export function AIFeedback({ prId, reviewId, isLoggedIn, initialFeedback }: AIFeedbackProps) {
    const [feedback, setFeedback] = useState<StructuredFeedback | null>(initialFeedback || null);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleGenerate = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
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
                    prId,
                    reviewId,
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



    return (
        <div className="space-y-6">
            <LoginModal
                isOpen={showLoginModal}
                onOpenChange={setShowLoginModal}
                title="Sign in to use AI Coach"
                description="Get personalized feedback on your code reviews by signing in with GitHub or Google."
            />

            {!feedback && (
                <Card className="border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-card">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center gap-4 min-h-[200px]">
                        {!isLoading ? (
                            <>
                                <div>
                                    <h3 className="text-lg font-medium flex items-center justify-center gap-2">
                                        <Sparkles className="h-5 w-5 text-indigo-500" />
                                        AI Review Coach
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get personalized coaching on your code review skills.
                                    </p>
                                </div>
                                <Button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Analyze My Review
                                </Button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                <div className="text-center space-y-1">
                                    <p className="font-medium">Analyzing your review...</p>
                                    <p className="text-xs text-muted-foreground">Evaluating tone, accuracy, and constructive feedback</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
                                            size="md"
                                        />
                                        <Gauge
                                            value={feedback.metrics.communication_style}
                                            label="Communication"
                                            size="md"
                                        />
                                        <Gauge
                                            value={feedback.metrics.constructiveness}
                                            label="Constructive"
                                            size="md"
                                        />
                                        <Gauge
                                            value={feedback.metrics.completeness}
                                            label="Completeness"
                                            size="md"
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

                    {/* Comment Analysis */}
                    {feedback.commentFeedback && feedback.commentFeedback.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquareQuote className="h-5 w-5 text-indigo-500" />
                                    Comment Analysis
                                </CardTitle>
                                <CardDescription>
                                    Detailed feedback on your specific comments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {feedback.commentFeedback.map((item) => {
                                    const userComment = item.originalComment;
                                    if (!userComment) return null;

                                    return (
                                        <div key={item.commentId} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Badge variant="outline">
                                                            Line {userComment.line_index}
                                                        </Badge>
                                                        <Badge variant={
                                                            userComment.severity === 'critical' ? 'destructive' :
                                                                userComment.severity === 'suggestion' ? 'default' : 'secondary'
                                                        }>
                                                            {userComment.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="font-medium text-sm italic border-l-2 border-muted-foreground/30 pl-3 py-1 my-2">
                                                        "{userComment.text}"
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 shrink-0">
                                                    <span className="text-xl font-bold text-indigo-600">{item.rating}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-border/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={
                                                        item.category === 'helpful' ? 'default' :
                                                            item.category === 'nitpick' ? 'secondary' :
                                                                item.category === 'incorrect' ? 'destructive' : 'outline'
                                                    } className={
                                                        item.category === 'helpful' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100' : ''
                                                    }>
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">AI Feedback</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
