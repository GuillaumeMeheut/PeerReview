"use client";

import { useState, useMemo } from "react";
import { PRCard } from "@/components/pr-card";
import { FilterBar } from "@/components/filter-bar";
import { PullRequest } from "@/lib/types";
import { X } from "lucide-react";

interface HomeContentProps {
    pullRequests: PullRequest[];
}

export function HomeContent({ pullRequests }: HomeContentProps) {
    const [selectedTechStack, setSelectedTechStack] = useState<Set<string>>(
        new Set(),
    );
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

    // Extract all unique options
    const techStackOptions = useMemo(() => {
        const options = new Set<string>();
        pullRequests.forEach((pr) => {
            pr.techStack.forEach((tech) => options.add(tech));
        });
        return Array.from(options).sort();
    }, [pullRequests]);

    const typeOptions = useMemo(() => {
        const options = new Set<string>();
        pullRequests.forEach((pr) => {
            options.add(pr.difficulty);
            pr.tags.forEach((tag) => options.add(tag));
        });
        return Array.from(options).sort();
    }, [pullRequests]);

    // Filter PRs
    const filteredPRs = useMemo(() => {
        return pullRequests.filter((pr) => {
            const matchesTech =
                selectedTechStack.size === 0 ||
                pr.techStack.some((tech) => selectedTechStack.has(tech));

            const matchesType =
                selectedTypes.size === 0 ||
                selectedTypes.has(pr.difficulty) ||
                pr.tags.some((tag) => selectedTypes.has(tag));

            return matchesTech && matchesType;
        });
    }, [pullRequests, selectedTechStack, selectedTypes]);

    const toggleTechStack = (tech: string) => {
        const newSet = new Set(selectedTechStack);
        if (newSet.has(tech)) {
            newSet.delete(tech);
        } else {
            newSet.add(tech);
        }
        setSelectedTechStack(newSet);
    };

    const toggleType = (type: string) => {
        const newSet = new Set(selectedTypes);
        if (newSet.has(type)) {
            newSet.delete(type);
        } else {
            newSet.add(type);
        }
        setSelectedTypes(newSet);
    };

    const clearAll = () => {
        setSelectedTechStack(new Set());
        setSelectedTypes(new Set());
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
            <FilterBar
                techStackOptions={techStackOptions}
                typeOptions={typeOptions}
                selectedTechStack={selectedTechStack}
                selectedTypes={selectedTypes}
                onToggleTechStack={toggleTechStack}
                onToggleType={toggleType}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
