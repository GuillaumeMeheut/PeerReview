"use client";

import { useState, useMemo } from "react";
import { PRCard } from "@/components/pr-card";
import { FilterBar } from "@/components/filter-bar";
import { PullRequest } from "@/lib/types";
import { X, Sparkles } from "lucide-react";
import posthog from "posthog-js";

interface HomeContentProps {
    pullRequests: PullRequest[];
}

export function HomeContent({ pullRequests }: HomeContentProps) {
    const [selectedTechStack, setSelectedTechStack] = useState<Set<string>>(
        new Set(),
    );

    // Extract all unique options
    const techStackOptions = useMemo(() => {
        const options = new Set<string>();
        pullRequests.forEach((pr) => {
            pr.tech_stack.forEach((tech) => options.add(tech));
        });
        return Array.from(options).sort();
    }, [pullRequests]);

    // Filter PRs
    const filteredPRs = useMemo(() => {
        return pullRequests.filter((pr) => {
            const matchesTech =
                selectedTechStack.size === 0 ||
                pr.tech_stack.some((tech) => selectedTechStack.has(tech));

            return matchesTech;
        });
    }, [pullRequests, selectedTechStack]);

    const toggleTechStack = (tech: string) => {
        const newSet = new Set(selectedTechStack);
        if (newSet.has(tech)) {
            newSet.delete(tech);
        } else {
            newSet.add(tech);
        }
        setSelectedTechStack(newSet);
        posthog.capture("problems_filtered", {
            tech_stack: Array.from(newSet),
            filter_count: newSet.size,
        });
    };

    const clearAll = () => {
        setSelectedTechStack(new Set());
    };

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Background ambient accents */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
                {/* Hero Section */}
                <div className="relative z-10 mx-auto max-w-4xl text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Sparkles className="h-4 w-4" />
                        <span>Ready to review?</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        Explore <span className="text-primary">Pull Requests</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Level up your code review skills by exploring and reviewing real-world code changes. Select your preferred tech stack and dive in.
                    </p>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <FilterBar
                        techStackOptions={techStackOptions}
                        selectedTechStack={selectedTechStack}
                        onToggleTechStack={toggleTechStack}
                        onClearAll={clearAll}
                    />

                    {/* Content Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 mt-12 bg-background/60 backdrop-blur-md border border-border/50 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                                Exercises
                            </h2>
                            <div className="h-4 w-[1px] bg-border hidden sm:block"></div>
                            <span className="text-sm text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{filteredPRs.length}</span> of {pullRequests.length}
                            </span>
                        </div>
                    </div>

                    {filteredPRs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                            {filteredPRs.map((pr) => (
                                <PRCard key={pr.id} pr={pr} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-24 bg-card/30 backdrop-blur-sm rounded-2xl border border-dashed border-border mb-12 duration-500 animate-in fade-in zoom-in-95">
                            <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mb-5 border border-border/50">
                                <X className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground tracking-tight">No exercises found</h3>
                            <p className="text-muted-foreground mb-8 max-w-sm text-sm">
                                We couldn't find any pull requests matching your exact filter combination.
                            </p>
                            <button
                                onClick={clearAll}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
