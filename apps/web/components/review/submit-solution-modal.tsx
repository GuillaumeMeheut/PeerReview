"use client";

import { useState, useTransition } from "react";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { submitSolution, fetchUserReviewHistory } from "@/lib/supabase/actions";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface SubmitSolutionModalProps {
    prId: string;
}

export function SubmitSolutionModal({ prId }: SubmitSolutionModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [selectedReview, setSelectedReview] = useState<string>("");
    const [description, setDescription] = useState("");


    const { data: userReviews = [], isLoading: isLoadingReviews } = useQuery({
        queryKey: ["userReviews", prId],
        queryFn: () => fetchUserReviewHistory(prId),
        enabled: open, // Only fetch when modal is open
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setDescription("");
            setSelectedReview("");
        }
    };

    const handleSubmit = () => {
        if (!description.trim()) {
            toast.error("Please enter a description for your solution.");
            return;
        }

        if (!selectedReview) {
            toast.error("Please select a review to link.");
            return;
        }

        startTransition(async () => {
            try {
                console.log(selectedReview);
                const result = await submitSolution({
                    exerciseId: prId,
                    description,
                    userReviewId: selectedReview,
                });

                if (result.error) {
                    toast.error(result.error);
                    return;
                }

                toast.success("Solution submitted successfully!");
                setOpen(false);
                setDescription("");
                setSelectedReview("");
            } catch (error) {
                console.error("Error submitting solution:", error);
                toast.error("An unexpected error occurred");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Submit Solution
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Submit a Solution</DialogTitle>
                    <DialogDescription>
                        Share your general approach and link a previous code review so others can see your comments.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Link a Review
                        </label>
                        <Select value={selectedReview} onValueChange={setSelectedReview} disabled={isLoadingReviews}>
                            <SelectTrigger>
                                <SelectValue placeholder={isLoadingReviews ? "Loading reviews..." : "Select a previous review..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {userReviews.length === 0 && !isLoadingReviews ? (
                                    <SelectItem value="empty" disabled>No reviews found</SelectItem>
                                ) : (
                                    userReviews.map((review) => (
                                        <SelectItem key={review.id} value={review.id}>
                                            Review from {format(new Date(review.createdAt), "MMM d, yyyy 'at' h:mm a")} ({review.commentCount} comments)
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Other users will be able to click through to see your specific comments on the PR.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Description
                        </label>
                        <Textarea
                            placeholder="Explain your approach, architectural decisions, and why you chose this solution..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending || !description.trim() || !selectedReview}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Solution
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
