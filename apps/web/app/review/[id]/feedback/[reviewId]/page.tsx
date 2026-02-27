import { getUser, getAIFeedbackForReview, getExercise } from "@/lib/supabase/queries";
import { AIFeedback } from "@/components/review/ai-feedback";
import type { ReviewFeedback } from "@/lib/types";
import { SubmissionHistory } from "@/components/review/submission-history";
import { FeedbackTab } from "@/components/review/feedback-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Sparkles, BookOpen } from "lucide-react";

type Params = Promise<{ id: string, reviewId: string }>;

export default async function FeedbackAIPage({ params }: { params: Params }) {
    const { id, reviewId } = await params;

    const { user } = await getUser();
    const initialFeedback = await getAIFeedbackForReview(reviewId);

    const pr = await getExercise(id);
    if (!pr) return null;

    const feedback: ReviewFeedback = {
        id: "static",
        created_at: new Date().toISOString(),
        review_id: reviewId,
        overall_score: initialFeedback?.overallScore ?? 0,
        summary: initialFeedback?.summary ?? "",
        strengths: initialFeedback?.strengths ?? [],
        improvements: initialFeedback?.improvements ?? [],
        technical_accuracy: initialFeedback?.metrics?.technical_accuracy ?? 0,
        communication_style: initialFeedback?.metrics?.communication_style ?? 0,
        constructiveness: initialFeedback?.metrics?.constructiveness ?? 0,
        completeness: initialFeedback?.metrics?.completeness ?? 0,
        comment_feedback: initialFeedback?.commentFeedback ?? [],
        expected_issues: (pr as any).expected_issues ?? [],
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Review Feedback</h1>
                    <p className="text-muted-foreground">Detailed analysis and automated evaluation of your code review.</p>
                </div>
                <div className="shrink-0">
                    <SubmissionHistory exerciseId={id} currentReviewId={reviewId} />
                </div>
            </div>

            <Tabs defaultValue="ai-coach" className="w-full">
                <TabsList className="mb-8 flex h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                    <TabsTrigger
                        value="ai-coach"
                        className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        <Sparkles className="h-4 w-4" />
                        AI Coach Evaluation
                    </TabsTrigger>
                    <TabsTrigger
                        value="static-solution"
                        className="relative flex items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 text-sm font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                        <BookOpen className="h-4 w-4" />
                        Reference Solution
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ai-coach" className="mt-0 outline-none">
                    <AIFeedback prId={id} reviewId={reviewId} isLoggedIn={!!user} initialFeedback={initialFeedback} />
                </TabsContent>

                <TabsContent value="static-solution" className="mt-0 outline-none">
                    <FeedbackTab pr={pr} feedback={feedback} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
