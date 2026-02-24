
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
    MessageSquareQuote,
    Bot,
    User
} from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { Gauge } from "@workspace/ui/components/gauge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
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
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/30 dark:via-card dark:to-slate-900/50 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <CardContent className="pt-8 pb-8 relative z-10">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="shrink-0 relative">
                                    <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 blur-xl rounded-full" />
                                    <Gauge value={feedback.overallScore} size="lg" className="w-40 h-40 relative z-10 ring-8 ring-white dark:ring-card rounded-full" />
                                </div>
                                <div className="space-y-5 flex-1 w-full text-center md:text-left">
                                    <div>
                                        <h4 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Review Summary</h4>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl text-sm md:text-base">
                                            {feedback.summary}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                                        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
                                            <Gauge
                                                value={feedback.metrics.technical_accuracy}
                                                label=""
                                                size="sm"
                                            />
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Accuracy</span>
                                        </div>
                                        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
                                            <Gauge
                                                value={feedback.metrics.communication_style}
                                                label=""
                                                size="sm"
                                            />
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Communication</span>
                                        </div>
                                        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
                                            <Gauge
                                                value={feedback.metrics.constructiveness}
                                                label=""
                                                size="sm"
                                            />
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Constructive</span>
                                        </div>
                                        <div className="bg-white/60 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
                                            <Gauge
                                                value={feedback.metrics.completeness}
                                                label=""
                                                size="sm"
                                            />
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Completeness</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8 mt-4">
                        {/* Actionable Feedback Section */}
                        {((feedback.improvements && feedback.improvements.length > 0) || (feedback.commentFeedback && feedback.commentFeedback.some(c => c.category === 'incorrect' || c.category === 'nitpick'))) && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1 border-b pb-2">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Actionable Feedback</h3>
                                </div>

                                {feedback.improvements && feedback.improvements.length > 0 && (
                                    <Card className="border-red-100/50 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400">High-level Areas for Improvement</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {feedback.improvements.map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                        <span className="text-red-500 shrink-0">•</span>
                                                        <span className="leading-relaxed">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {feedback.commentFeedback && feedback.commentFeedback.filter(c => c.category === 'incorrect' || c.category === 'nitpick').length > 0 && (
                                    <div className="grid gap-4">
                                        {feedback.commentFeedback.filter(c => c.category === 'incorrect' || c.category === 'nitpick').map((item) => {
                                            const userComment = item.originalComment;
                                            if (!userComment) return null;
                                            const isError = item.category === 'incorrect';

                                            return (
                                                <Card key={item.commentId} className={`overflow-hidden border-l-4 ${isError ? 'border-l-red-500 border-red-100 dark:border-red-900/30' : 'border-l-amber-500 border-amber-100 dark:border-amber-900/30'} shadow-sm`}>
                                                    <div className="bg-slate-50/50 dark:bg-slate-900/20 p-4 border-b">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div className="flex flex-col gap-1.5">
                                                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Comment</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="outline" className="text-[10px] h-5 bg-background font-mono">
                                                                        Line {userComment.line_index}
                                                                    </Badge>
                                                                    <Badge variant="secondary" className="text-[10px] h-5">
                                                                        {userComment.severity}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            "{userComment.text}"
                                                        </p>
                                                    </div>

                                                    <div className={`p-4 ${isError ? 'bg-red-50/30 dark:bg-red-950/20' : 'bg-amber-50/30 dark:bg-amber-950/20'}`}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Bot className={`h-4 w-4 ${isError ? 'text-red-600' : 'text-amber-600'}`} />
                                                            <span className={`text-xs font-bold uppercase tracking-wider ${isError ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                                                AI Correction
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* What Went Well Section */}
                        {((feedback.strengths && feedback.strengths.length > 0) || (feedback.commentFeedback && feedback.commentFeedback.some(c => c.category === 'helpful'))) && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center gap-2 px-1 pb-2">
                                    <Trophy className="h-5 w-5 text-green-500" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">What Went Well</h3>
                                </div>

                                {feedback.strengths && feedback.strengths.length > 0 && (
                                    <Card className="border-green-100/50 dark:border-green-900/30 bg-green-50/10 dark:bg-green-900/10 shadow-sm mb-4">
                                        <CardContent className="pt-6">
                                            <ul className="space-y-2">
                                                {feedback.strengths.map((item, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {feedback.commentFeedback && feedback.commentFeedback.filter(c => c.category === 'helpful').length > 0 && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {feedback.commentFeedback.filter(c => c.category === 'helpful').map((item) => {
                                            const userComment = item.originalComment;
                                            if (!userComment) return null;

                                            return (
                                                <Card key={item.commentId} className="border-green-100 dark:border-green-900/30 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                                    <div className="p-3 border-b bg-slate-50/50 dark:bg-slate-900/20">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="text-[10px] h-4 font-mono bg-background">L{userComment.line_index}</Badge>
                                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Good Catch</span>
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 italic line-clamp-3">
                                                            "{userComment.text}"
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-card flex-1">
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            {item.feedback}
                                                        </p>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
