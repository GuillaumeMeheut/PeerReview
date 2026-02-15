"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { PRContext } from "./pr-context";
import { FileTree } from "./file-tree";
import { DiffViewer } from "./diff-viewer";
import { SubmitReview } from "./submit-review";
import { FeedbackTab } from "./feedback-tab";
import { DiscussionTab } from "./discussion-tab";
import { SolutionsTab } from "./solutions-tab";
import { GitPullRequest, ArrowLeft, MessageSquare, Lock } from "lucide-react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@workspace/ui/components/tabs";
import type { PullRequest, InlineComment, Severity, Discussion, DiscussionReply } from "@/lib/types";
import { Button } from "@workspace/ui/components/button";

export function ReviewClient({ pr }: { pr: PullRequest }) {
    const [comments, setComments] = useState<Map<string, InlineComment>>(
        new Map()
    );
    const [activeSolutionId, setActiveSolutionId] = useState<string | null>(null);
    const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("review");
    const [submitted, setSubmitted] = useState(false);
    const [discussions, setDiscussions] = useState<Discussion[]>(
        pr.discussions || []
    );
    const fileRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

    // Derived state for comments
    const activeSolution = activeSolutionId
        ? pr.solutions?.find(s => s.id === activeSolutionId)
        : null;

    const displayedComments = activeSolutionId && activeSolution
        ? new Map(activeSolution.comments.map(c => [`${c.fileIndex}-0-${c.lineIndex}`, c]))
        : comments;

    // Reset solution view when switching tab to "review" manually
    const handleTabChange = (value: string) => {
        if (value === "review" && activeSolutionId) {
            setActiveSolutionId(null);
        }
        setActiveTab(value);
    };

    const handleSelectSolution = useCallback((solutionId: string) => {
        setActiveSolutionId(solutionId);
        setActiveTab("review");
    }, []);

    // Read-only logic: disable editing if viewing a solution
    const isReadOnly = !!activeSolutionId;

    const handleAddComment = useCallback(
        (fileIndex: number, lineIndex: number, text: string, severity: Severity) => {
            if (isReadOnly) return;
            const key = `${fileIndex}-0-${lineIndex}`;
            setComments((prev) => {
                const next = new Map(prev);
                next.set(key, {
                    id: key,
                    fileIndex,
                    lineIndex,
                    text,
                    severity,
                    timestamp: Date.now(),
                });
                return next;
            });
        },
        [isReadOnly]
    );

    const handleEditComment = useCallback(
        (commentKey: string, newText: string, newSeverity: Severity) => {
            if (isReadOnly) return;
            setComments((prev) => {
                const next = new Map(prev);
                const comment = next.get(commentKey);
                if (comment) {
                    next.set(commentKey, { ...comment, text: newText, severity: newSeverity });
                }
                return next;
            });
        },
        [isReadOnly]
    );

    const handleDeleteComment = useCallback((commentKey: string) => {
        if (isReadOnly) return;
        setComments((prev) => {
            const next = new Map(prev);
            next.delete(commentKey);
            return next;
        });
    }, [isReadOnly]);

    const handleFileClick = useCallback((index: number) => {
        setActiveFileIndex(index);
        const ref = fileRefs.current.get(index);
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    const handleSubmitReview = useCallback(() => {
        setSubmitted(true);
        setActiveTab("feedback");
    }, []);

    const handleUpvote = useCallback((id: string) => {
        setDiscussions((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d
            )
        );
    }, []);

    const handleReply = useCallback((discussionId: string, content: string) => {
        setDiscussions((prev) =>
            prev.map((d) => {
                if (d.id === discussionId) {
                    const newReply: DiscussionReply = {
                        id: `r-${Date.now()}`,
                        author: {
                            name: "You",
                            avatar: "https://github.com/shadcn.png",
                        },
                        content,
                        timestamp: Date.now(),
                    };
                    return {
                        ...d,
                        replies: [...(d.replies || []), newReply],
                        replyCount: d.replyCount + 1,
                    };
                }
                return d;
            })
        );
    }, []);

    const handleAddDiscussion = useCallback((content: string) => {
        const newDiscussion: Discussion = {
            id: `d-${Date.now()}`,
            author: {
                name: "You",
                avatar: "https://github.com/shadcn.png",
            },
            content,
            timestamp: Date.now(),
            upvotes: 0,
            replyCount: 0,
            replies: [],
        };
        setDiscussions((prev) => [newDiscussion, ...prev]);
    }, []);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded bg-foreground">
                                <GitPullRequest className="h-3 w-3 text-background" />
                            </div>
                            <span
                                className="text-sm font-semibold"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                PeerReview
                            </span>
                        </div>
                    </Link>
                    <span className="text-muted-foreground/30">/</span>
                    <span className="text-sm text-muted-foreground truncate">
                        {pr.title}
                    </span>
                    {activeSolution && (
                        <div className="ml-auto flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                                <Lock className="w-3 h-3" />
                                Viewing Solution by {activeSolution.author.name}
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setActiveSolutionId(null)}
                            >
                                Return to your review
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                {/* Block 1: Context */}
                <PRContext pr={pr} />

                {/* Block 2: Tabs */}
                {/* @ts-ignore */}
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList variant="line" className="border-b border-border/30 w-full justify-start">
                        <TabsTrigger value="review" className="gap-1.5">
                            <GitPullRequest className="h-3.5 w-3.5" />
                            {activeSolution ? `Solution based on ${activeSolution.author.name}` : "My Review"}
                        </TabsTrigger>
                        <TabsTrigger value="discussions" className="gap-1.5">
                            <MessageSquare className="h-3 w-3" />
                            Discussions
                        </TabsTrigger>
                        <TabsTrigger
                            value="feedback"
                            disabled={!submitted}
                            className="gap-1.5"
                        >
                            {!submitted && <Lock className="h-3 w-3" />}
                            Feedback
                        </TabsTrigger>

                        <TabsTrigger value="solutions" className="gap-1.5">
                            {/* Remove disabled and lock icon for now to test, 
                               or check logic if users should only see solutions after submit? 
                               Req says "list of people that has choose to publish" 
                               Usually this is locked until submit, but user didn't specify lock condition.
                               I will unlock it for now as per instructions "there should be list of people..."
                           */}
                            <Lock className="h-3 w-3 opacity-50" />
                            Solutions
                        </TabsTrigger>
                    </TabsList>

                    {/* My Review Tab */}
                    {/* @ts-ignore */}
                    <TabsContent value="review">
                        <div className="flex gap-4 mt-4">
                            {/* Left: File Tree */}
                            <div className="w-72 shrink-0">
                                <div className="sticky top-20">
                                    <FileTree
                                        files={pr.files}
                                        activeFileIndex={activeFileIndex}
                                        onFileClick={handleFileClick}
                                    />
                                </div>
                            </div>

                            {/* Right: Diff Viewer */}
                            <div className="flex-1 min-w-0 space-y-6">
                                <div className={isReadOnly ? "pointer-events-none opacity-90" : ""}>
                                    <DiffViewer
                                        files={pr.files}
                                        comments={displayedComments}
                                        onAddComment={handleAddComment}
                                        onEditComment={handleEditComment}
                                        onDeleteComment={handleDeleteComment}
                                        fileRefs={fileRefs}
                                        readOnly={isReadOnly}
                                    />
                                </div>
                                {!isReadOnly && (
                                    <SubmitReview
                                        comments={comments}
                                        files={pr.files}
                                        prId={pr.id}
                                        onSubmit={handleSubmitReview}
                                    />
                                )}
                                {isReadOnly && (
                                    <div className="flex items-center justify-center p-8 bg-muted/20 border border-dashed border-border rounded-lg">
                                        <p className="text-muted-foreground text-sm">
                                            You are viewing a reference solution.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Discussions Tab */}
                    {/* @ts-ignore */}
                    <TabsContent value="discussions">
                        <DiscussionTab
                            discussions={discussions}
                            onUpvote={handleUpvote}
                            onReply={handleReply}
                            onAddDiscussion={handleAddDiscussion}
                        />
                    </TabsContent>

                    {/* Feedback Tab */}
                    {/* @ts-ignore */}
                    <TabsContent value="feedback">
                        {submitted && <FeedbackTab feedback={pr.feedback} />}
                    </TabsContent>

                    {/* Solutions Tab */}
                    {/* @ts-ignore */}
                    <TabsContent value="solutions">
                        <SolutionsTab
                            solutions={pr.solutions || []}
                            onSelectSolution={handleSelectSolution}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
