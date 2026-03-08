"use client";

import { useState, useMemo } from "react";
import { PRCard } from "@/components/pr-card";
import { FilterBar } from "@/components/filter-bar";
import { PullRequest, Difficulty } from "@/lib/types";
import { X } from "lucide-react";
import posthog from "posthog-js";

interface HomeContentProps {
    pullRequests: PullRequest[];
}

export function HomeContent({ pullRequests }: HomeContentProps) {
    const [selectedTechStack, setSelectedTechStack] = useState<Set<string>>(new Set());
    const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());

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
            const matchesDifficulty =
                selectedDifficulties.size === 0 ||
                selectedDifficulties.has(pr.difficulty as Difficulty);
            return matchesTech && matchesDifficulty;
        });
    }, [pullRequests, selectedTechStack, selectedDifficulties]);

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

    const toggleDifficulty = (difficulty: Difficulty) => {
        const newSet = new Set(selectedDifficulties);
        if (newSet.has(difficulty)) {
            newSet.delete(difficulty);
        } else {
            newSet.add(difficulty);
        }
        setSelectedDifficulties(newSet);
    };

    const clearAll = () => {
        setSelectedTechStack(new Set());
        setSelectedDifficulties(new Set());
    };

    return (
        <div className="relative z-10 max-w-6xl mx-auto">
                    <FilterBar
                        techStackOptions={techStackOptions}
                        selectedTechStack={selectedTechStack}
                        onToggleTechStack={toggleTechStack}
                        selectedDifficulties={selectedDifficulties}
                        onToggleDifficulty={toggleDifficulty}
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
    );
}
