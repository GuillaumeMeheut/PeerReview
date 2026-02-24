"use client";

import { Button } from "@workspace/ui/components/button";
import { FileCode, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import type { DiffFile } from "@/lib/types";

interface FileTreeProps {
    files: DiffFile[];
    activeFileIndex: number | null;
    onFileClick: (index: number) => void;
}

export function FileTree({ files, activeFileIndex, onFileClick }: FileTreeProps) {
    return (
        <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Files changed
                </h3>
            </div>
            <div className="divide-y divide-border/30">
                {files.map((file, index) => {
                    const parts = file.path.split("/");
                    const fileName = parts.pop();
                    const dirPath = parts.join("/");

                    return (
                        <Button
                            key={file.path}
                            variant="ghost"
                            onClick={() => onFileClick(index)}
                            className={cn(
                                "w-full justify-start h-auto px-4 py-2.5 flex items-center gap-2 text-xs rounded-none",
                                activeFileIndex === index && "bg-muted/50 border-l-2 border-l-blue-400"
                            )}
                        >
                            <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <div className="min-w-0 flex-1 text-left truncate">
                                {dirPath && (
                                    <span className="text-muted-foreground/60">{dirPath}/</span>
                                )}
                                <span className="font-medium">{fileName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-emerald-400 font-mono text-[10px]">
                                    +{file.additions}
                                </span>
                                <span className="text-red-400 font-mono text-[10px]">
                                    -{file.deletions}
                                </span>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
