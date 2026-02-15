"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { PRContext } from "./pr-context";
import { FileTree } from "./file-tree";
import { DiffViewer } from "./diff-viewer";
import { SubmitReview } from "./submit-review";
import { FeedbackTab } from "./feedback-tab";
import { GitPullRequest, ArrowLeft, MessageSquare, Lock } from "lucide-react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@workspace/ui/components/tabs";
import type { PullRequest, InlineComment, Severity } from "@/lib/types";

export function ReviewClient({ pr }: { pr: PullRequest }) {
    const [comments, setComments] = useState<Map<string, InlineComment>>(
        new Map()
    );
    const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("review");
    const [submitted, setSubmitted] = useState(false);
    const fileRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

    const handleAddComment = useCallback(
        (fileIndex: number, lineIndex: number, text: string, severity: Severity) => {
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
        []
    );

    const handleEditComment = useCallback(
        (commentKey: string, newText: string, newSeverity: Severity) => {
            setComments((prev) => {
                const next = new Map(prev);
                const comment = next.get(commentKey);
                if (comment) {
                    next.set(commentKey, { ...comment, text: newText, severity: newSeverity });
                }
                return next;
            });
        },
        []
    );

    const handleDeleteComment = useCallback((commentKey: string) => {
        setComments((prev) => {
            const next = new Map(prev);
            next.delete(commentKey);
            return next;
        });
    }, []);

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
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                {/* Block 1: Context */}
                <PRContext pr={pr} />

                {/* Block 2: Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList variant="line" className="border-b border-border/30 w-full justify-start">
                        <TabsTrigger value="review" className="gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            My Review
                        </TabsTrigger>
                        <TabsTrigger
                            value="feedback"
                            disabled={!submitted}
                            className="gap-1.5"
                        >
                            {!submitted && <Lock className="h-3 w-3" />}
                            Feedback
                        </TabsTrigger>
                        <TabsTrigger value="discussions" className="gap-1.5">
                            <MessageSquare className="h-3 w-3" />
                            Discussions
                        </TabsTrigger>
                        <TabsTrigger value="solutions" disabled className="gap-1.5">
                            <Lock className="h-3 w-3" />
                            Solutions
                        </TabsTrigger>
                    </TabsList>

                    {/* My Review Tab */}
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
                                <DiffViewer
                                    files={pr.files}
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                    onEditComment={handleEditComment}
                                    onDeleteComment={handleDeleteComment}
                                    fileRefs={fileRefs}
                                />
                                <SubmitReview
                                    comments={comments}
                                    files={pr.files}
                                    prId={pr.id}
                                    onSubmit={handleSubmitReview}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Feedback Tab */}
                    <TabsContent value="feedback">
                        {submitted && <FeedbackTab feedback={pr.feedback} />}
                    </TabsContent>

                    {/* Discussions Tab (placeholder) */}
                    <TabsContent value="discussions">
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Lock className="h-8 w-8 mb-3 opacity-40" />
                            <p className="text-sm font-medium">Coming soon</p>
                            <p className="text-xs mt-1 opacity-60">
                                Discuss the PR with other reviewers
                            </p>
                        </div>
                    </TabsContent>

                    {/* Solutions Tab (placeholder) */}
                    <TabsContent value="solutions">
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <Lock className="h-8 w-8 mb-3 opacity-40" />
                            <p className="text-sm font-medium">Coming soon</p>
                            <p className="text-xs mt-1 opacity-60">
                                See reference solutions and best practices
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
