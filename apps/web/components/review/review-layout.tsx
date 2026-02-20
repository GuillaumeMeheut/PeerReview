"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, GitPullRequest, MessageSquare, Sparkles, Lightbulb, Lock } from "lucide-react";
import { PRContext } from "@/components/review/pr-context";
import { PullRequest } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";

export function ReviewLayout({
    pr,
    latestReviewId,
    children,
}: {
    pr: PullRequest;
    latestReviewId: string | null;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const baseUrl = `/review/${pr.id}`;

    // Simple check to see active tab
    const isActive = (path: string) => {
        if (path === baseUrl && pathname === baseUrl) return true;
        if (path !== baseUrl && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen">
                {/* Header */}
                <header className="border-b border-border/50 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
                    <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center gap-4">
                        <Link
                            href="/problems"
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

                    {/* Block 2: Tabs Navigation */}
                    <div className="border-b border-border/30 w-full flex">
                        <TabLink
                            href={baseUrl}
                            isActive={isActive(baseUrl)}
                            icon={<GitPullRequest className="h-3.5 w-3.5" />}
                            label="My Review"
                        />
                        <TabLink
                            href={latestReviewId ? `${baseUrl}/feedback/${latestReviewId}` : ""}
                            isActive={isActive(`${baseUrl}/feedback`)}
                            icon={latestReviewId ? <Sparkles className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                            label="Feedback"
                            isDisabled={!latestReviewId}
                            tooltipMessage="Submit a review first to unlock AI feedback"
                        />
                        <TabLink
                            href={`${baseUrl}/discussions`}
                            isActive={isActive(`${baseUrl}/discussions`)}
                            icon={<MessageSquare className="h-3 w-3" />}
                            label="Discussions"
                        />

                        <TabLink
                            href={`${baseUrl}/solutions`}
                            isActive={isActive(`${baseUrl}/solutions`)}
                            icon={<Lightbulb className="h-3 w-3" />}
                            label="Solutions"
                        />
                    </div>
                    {children}
                </div>
            </div>
        </TooltipProvider>
    );
}

function TabLink({
    href,
    isActive,
    icon,
    label,
    isDisabled,
    tooltipMessage,
}: {
    href: string;
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
    isDisabled?: boolean;
    tooltipMessage?: string;
}) {
    const content = (
        <div
            className={cn(
                "flex-1 flex items-center justify-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 pt-2",
                isActive
                    ? "border-primary text-foreground bg-muted/30"
                    : "border-transparent text-muted-foreground",
                isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted/50 hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </div>
    );

    if (isDisabled && tooltipMessage) {
        return (
            <div className="flex-1 flex">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full cursor-not-allowed">{content}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipMessage}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        );
    }

    return (
        <Link href={href} className={cn("flex-1 flex", isDisabled && "pointer-events-none")}>
            <div className="w-full">{content}</div>
        </Link>
    );
}
