"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";

interface FilterBarProps {
    techStackOptions: string[];
    typeOptions: string[];
    selectedTechStack: Set<string>;
    selectedTypes: Set<string>;
    onToggleTechStack: (tech: string) => void;
    onToggleType: (type: string) => void;
    onClearAll: () => void;
}

export function FilterBar({
    techStackOptions,
    typeOptions,
    selectedTechStack,
    selectedTypes,
    onToggleTechStack,
    onToggleType,
    onClearAll,
}: FilterBarProps) {
    const hasFilters = selectedTechStack.size > 0 || selectedTypes.size > 0;

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Language / Framework
                </h3>
                <div className="flex flex-wrap gap-2">
                    {techStackOptions.map((tech) => (
                        <Badge
                            key={tech}
                            variant={
                                selectedTechStack.has(tech)
                                    ? "default"
                                    : "secondary"
                            }
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onToggleTechStack(tech)}
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    PR Type & Difficulty
                </h3>
                <div className="flex flex-wrap gap-2">
                    {typeOptions.map((type) => (
                        <Badge
                            key={type}
                            variant={
                                selectedTypes.has(type) ? "default" : "secondary"
                            }
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onToggleType(type)}
                        >
                            {type}
                        </Badge>
                    ))}
                </div>
            </div>

            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={onClearAll}
                >
                    <X className="mr-1 h-3 w-3" />
                    Clear all filters
                </Button>
            )}
        </div>
    );
}
