"use client";

import { useState, useMemo } from "react";
import { PRCard } from "@/components/pr-card";
import { FilterBar } from "@/components/filter-bar";
import { PullRequest } from "@/lib/types";
import { X } from "lucide-react";
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
        <main className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    Explore Pull Requests
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Level up your code review skills by exploring and reviewing pull requests.
                </p>
            </div>

            <FilterBar
                techStackOptions={techStackOptions}
                selectedTechStack={selectedTechStack}
                onToggleTechStack={toggleTechStack}
                onClearAll={clearAll}
            />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Pull Requests
                </h2>
                <span className="text-xs text-muted-foreground/60">
                    {filteredPRs.length} of {pullRequests.length} available
                </span>
            </div>

            {filteredPRs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPRs.map((pr) => (
                        <PRCard key={pr.id} pr={pr} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
                    <p className="text-muted-foreground">
                        No pull requests match your filters.
                    </p>
                    <button
                        onClick={clearAll}
                        className="text-primary hover:underline mt-2 text-sm font-medium flex items-center justify-center gap-1 mx-auto"
                    >
                        <X className="h-3 w-3" />
                        Clear filters
                    </button>
                </div>
            )}
        </main>
    );
}
