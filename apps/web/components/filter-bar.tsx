"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { X, Code2 } from "lucide-react";
import {
    SiReact, SiNextdotjs, SiTypescript, SiNodedotjs,
    SiTailwindcss, SiPostgresql, SiSupabase, SiPython, SiRedux, SiHtml5, SiCss3
} from "react-icons/si";
import { DiJavascript1 } from "react-icons/di";

const techIcons: Record<string, React.ElementType> = {
    "React": SiReact,
    "Next.js": SiNextdotjs,
    "TypeScript": SiTypescript,
    "Node.js": SiNodedotjs,
    "Tailwind CSS": SiTailwindcss,
    "PostgreSQL": SiPostgresql,
    "Supabase": SiSupabase,
    "JavaScript": DiJavascript1,
    "Python": SiPython,
    "Redux": SiRedux,
    "HTML": SiHtml5,
    "CSS": SiCss3,
};

interface FilterBarProps {
    techStackOptions: string[];
    selectedTechStack: Set<string>;
    onToggleTechStack: (tech: string) => void;
    onClearAll: () => void;
}

export function FilterBar({
    techStackOptions,
    selectedTechStack,
    onToggleTechStack,
    onClearAll,
}: FilterBarProps) {
    const hasFilters = selectedTechStack.size > 0;

    return (
        <div className="space-y-4 mb-8">
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stack Selection
                </h3>
                <div className="flex flex-wrap gap-2">
                    {techStackOptions.map((tech) => {
                        const Icon = techIcons[tech] || Code2;
                        return (
                            <Badge
                                key={tech}
                                variant={
                                    selectedTechStack.has(tech)
                                        ? "default"
                                        : "secondary"
                                }
                                className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5 px-3 py-1 text-sm"
                                onClick={() => onToggleTechStack(tech)}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tech}
                            </Badge>
                        );
                    })}
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
