"use client";

import { useState, useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { FileCode, ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import type { DiffFile } from "@/lib/types";

interface FileTreeProps {
    files: DiffFile[];
    activeFileIndex: number | null;
    onFileClick: (index: number) => void;
}

type FileSystemNode = {
    type: "file" | "folder";
    name: string;
    path: string;
    children?: Record<string, FileSystemNode>;
    fileIndex?: number;
    file?: DiffFile;
    additions: number;
    deletions: number;
};

function sortNodes(a: FileSystemNode, b: FileSystemNode) {
    if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
}

function DiffStats({ additions, deletions, className }: { additions: number; deletions: number; className?: string }) {
    if (additions === 0 && deletions === 0) return null;

    return (
        <div className={cn("flex items-center gap-1.5 shrink-0", className)}>
            {additions > 0 && (
                <span className="text-emerald-400 font-mono text-[10px]">
                    +{additions}
                </span>
            )}
            {deletions > 0 && (
                <span className="text-red-400 font-mono text-[10px]">
                    -{deletions}
                </span>
            )}
        </div>
    );
}

function compressNode(node: FileSystemNode) {
    if (node.type === "file" || !node.children) return;

    // First compress all children
    Object.values(node.children).forEach(compressNode);

    // Then check if we can compress current node with its single folder child
    const childKeys = Object.keys(node.children);
    if (childKeys.length === 1) {
        const firstKey = childKeys[0];
        if (!firstKey) return;

        const singleChild = node.children[firstKey];
        if (singleChild && singleChild.type === "folder") {
            node.name = `${node.name}/${singleChild.name}`;
            node.children = singleChild.children;
            node.path = singleChild.path;
        }
    }
}

function TreeNode({
    node,
    level,
    activeFileIndex,
    onFileClick,
}: {
    node: FileSystemNode;
    level: number;
    activeFileIndex: number | null;
    onFileClick: (index: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);

    // Sort children: folders first, then files, both alphabetically
    const childrenNodes = useMemo(() => {
        return node.children ? Object.values(node.children).sort(sortNodes) : [];
    }, [node.children]);

    const paddingLeft = `${1 + level * 0.75}rem`;

    if (node.type === "file") {
        return (
            <Button
                key={node.path}
                variant="ghost"
                onClick={() => onFileClick(node.fileIndex!)}
                className={cn(
                    "w-full justify-start h-auto py-1.5 flex items-center gap-2 text-xs rounded-none border-l-2 text-muted-foreground hover:text-foreground",
                    activeFileIndex === node.fileIndex
                        ? "bg-muted/50 border-l-blue-400 text-foreground"
                        : "border-l-transparent"
                )}
                style={{ paddingLeft, paddingRight: "1rem" }}
            >
                {/* 14px to match the Chevron's width and align icons */}
                <div className="w-3.5" />
                <FileCode className="h-3.5 w-3.5 shrink-0" />
                <div className="min-w-0 flex-1 text-left truncate">
                    <span className="font-medium">{node.name}</span>
                </div>
                <DiffStats additions={node.additions} deletions={node.deletions} />
            </Button>
        );
    }

    return (
        <div className="flex flex-col">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full justify-start h-auto py-1.5 flex items-center gap-2 text-xs rounded-none border-l-2 border-l-transparent text-muted-foreground hover:text-foreground"
                )}
                style={{ paddingLeft, paddingRight: "1rem" }}
            >
                {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                )}
                {isOpen ? (
                    <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                ) : (
                    <Folder className="h-3.5 w-3.5 shrink-0" />
                )}
                <div className="min-w-0 flex-1 text-left truncate">
                    <span className="font-medium">{node.name}</span>
                </div>
                <DiffStats
                    additions={node.additions}
                    deletions={node.deletions}
                    className="opacity-60"
                />
            </Button>
            {isOpen && (
                <div className="flex flex-col">
                    {childrenNodes.map((childNode) => (
                        <TreeNode
                            key={childNode.path}
                            node={childNode}
                            level={level + 1}
                            activeFileIndex={activeFileIndex}
                            onFileClick={onFileClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function FileTree({ files, activeFileIndex, onFileClick }: FileTreeProps) {
    const sortedRootNodes = useMemo(() => {
        const root: Record<string, FileSystemNode> = {};

        files.forEach((file, index) => {
            const parts = file.path.split("/");
            let currentLevel = root;
            let currentPath = "";

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (!part) continue;

                const isFile = i === parts.length - 1;
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                let currentNode = currentLevel[part];
                if (!currentNode) {
                    currentNode = {
                        type: isFile ? "file" : "folder",
                        name: part,
                        path: currentPath,
                        children: isFile ? undefined : {},
                        fileIndex: isFile ? index : undefined,
                        file: isFile ? file : undefined,
                        additions: 0,
                        deletions: 0,
                    };
                    currentLevel[part] = currentNode;
                }

                currentNode.additions += file.additions;
                currentNode.deletions += file.deletions;

                if (!isFile && currentNode.children) {
                    currentLevel = currentNode.children;
                }
            }
        });

        const rootNodes = Object.values(root);
        rootNodes.forEach(compressNode);

        return rootNodes.sort(sortNodes);
    }, [files]);

    return (
        <div className="border border-border/50 rounded-lg bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Files changed
                </h3>
            </div>
            <div className="py-2">
                {sortedRootNodes.map((node) => (
                    <TreeNode
                        key={node.path}
                        node={node}
                        level={0}
                        activeFileIndex={activeFileIndex}
                        onFileClick={onFileClick}
                    />
                ))}
            </div>
        </div>
    );
}
