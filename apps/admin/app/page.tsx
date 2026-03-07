"use client";

import { useState } from "react";
import { Copy, Loader2, ArrowRight, Github, CodeSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

export default function ImportPRPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sqlOutput, setSqlOutput] = useState<string | null>(null);

    // Initial PR data fetched from GitHub
    const [prData, setPrData] = useState<any | null>(null);

    // Form data that the user can customize before generating SQL
    const [exerciseDetails, setExerciseDetails] = useState({
        title: "",
        description: "",
        difficulty: "Mid",
        tech_stack: "React, TypeScript",
        tags: "refactor, ui",
        commonly_missed: "Placeholder issue 1"
    });

    const handleFetchPR = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSqlOutput(null);
        setPrData(null);

        try {
            const res = await fetch("/api/import-pr", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await res.json() as any;

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch PR");
            }

            setPrData(data);
            setExerciseDetails({
                title: data.exercise.title || "",
                description: data.exercise.description || "",
                difficulty: data.exercise.difficulty || "Mid",
                tech_stack: "React, TypeScript",
                tags: "refactor",
                commonly_missed: "Placeholder commonly missed item 1\nPlaceholder commonly missed item 2"
            });
            toast.success("Successfully fetched PR details!");
        } catch (err: any) {
            setError(err.message);
            toast.error("Failed to fetch PR details.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSQL = () => {
        // Overlay user customizations onto the fetched PR data
        const finalData = {
            ...prData,
            exercise: {
                ...prData.exercise,
                title: exerciseDetails.title,
                description: exerciseDetails.description,
                difficulty: exerciseDetails.difficulty,
                // Process comma-separated and newline-separated inputs into arrays
                tech_stack: exerciseDetails.tech_stack.split(",").map(s => s.trim()).filter(Boolean),
                tags: exerciseDetails.tags.split(",").map(s => s.trim()).filter(Boolean),
                commonly_missed: exerciseDetails.commonly_missed.split("\n").map(s => s.trim()).filter(Boolean),
            }
        };

        const sql = formatSqlOutput(finalData);
        setSqlOutput(sql);
        toast.success("SQL generated successfully!");
    };

    const handleCopy = async () => {
        if (sqlOutput) {
            try {
                await navigator.clipboard.writeText(sqlOutput);
                toast.success("Copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy to clipboard");
            }
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Generate Exercise from Pull Request</h1>
                <p className="text-muted-foreground">Automatically fetch a PR's diffs and generate database seed data for peer reviews.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        Step 1: Fetch GitHub PR
                    </CardTitle>
                    <CardDescription>Enter the URL of the public GitHub Pull Request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFetchPR} className="flex gap-4">
                        <Input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/owner/repo/pull/123"
                            className="flex-1"
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                            Fetch PR
                        </Button>
                    </form>
                    {error && (
                        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {prData && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CodeSquare className="w-5 h-5" />
                            Step 2: Customize Exercise Details
                        </CardTitle>
                        <CardDescription>Review and modify the metadata before generating the SQL output. Found {prData.files.length} files modified.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Title</label>
                            <Input
                                value={exerciseDetails.title}
                                onChange={(e) => setExerciseDetails({ ...exerciseDetails, title: e.target.value })}
                                placeholder="Exercise Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Description</label>
                            <Textarea
                                value={exerciseDetails.description}
                                onChange={(e) => setExerciseDetails({ ...exerciseDetails, description: e.target.value })}
                                placeholder="Exercise Description"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Difficulty</label>
                                <Input
                                    value={exerciseDetails.difficulty}
                                    onChange={(e) => setExerciseDetails({ ...exerciseDetails, difficulty: e.target.value })}
                                    placeholder="e.g. Junior, Mid, Senior"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Tech Stack (comma separated)</label>
                                <Input
                                    value={exerciseDetails.tech_stack}
                                    onChange={(e) => setExerciseDetails({ ...exerciseDetails, tech_stack: e.target.value })}
                                    placeholder="React, TypeScript, Node"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Tags (comma separated)</label>
                            <Input
                                value={exerciseDetails.tags}
                                onChange={(e) => setExerciseDetails({ ...exerciseDetails, tags: e.target.value })}
                                placeholder="refactor, performance, ui"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Commonly Missed Issues (one per line)</label>
                            <Textarea
                                value={exerciseDetails.commonly_missed}
                                onChange={(e) => setExerciseDetails({ ...exerciseDetails, commonly_missed: e.target.value })}
                                placeholder="Issue 1&#10;Issue 2"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGenerateSQL} className="w-full">
                            Generate SQL
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {sqlOutput && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>Step 3: Generated seed.sql</CardTitle>
                            <CardDescription>Copy this into your supabase/seed.sql file.</CardDescription>
                        </div>
                        <Button onClick={handleCopy} variant="secondary">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy to Clipboard
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                            {sqlOutput}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Generates the deterministic INSERT statements for seed.sql
function formatSqlOutput({ exercise, files }: any) {
    // Use a pseudo-random UUID generator for the SQL seed
    const generateUUID = () => crypto.randomUUID();
    const exerciseId = generateUUID();

    let sql = `-- ${"=".repeat(77)}\n`;
    sql += `-- Auto-generated Exercise from: ${exercise.title}\n`;
    sql += `-- ${"=".repeat(77)}\n\n`;

    // Format arrays into postgres format: array['val1', 'val2']
    const formatArray = (arr: string[]) => `array[${arr.map(s => `'${s.replace(/'/g, "''")}'`).join(", ")}]`;

    // 1. Insert Exercise
    sql += `insert into public.exercises (id, title, description, difficulty, tech_stack, tags, author, base_branch, head_branch, commonly_missed)\n`;
    sql += `values (\n`;
    sql += `  '${exerciseId}',\n`;
    sql += `  '${exercise.title.replace(/'/g, "''")}',\n`;
    sql += `  '${exercise.description.replace(/'/g, "''")}',\n`;
    sql += `  '${exercise.difficulty}',\n`;
    sql += `  ${formatArray(exercise.tech_stack)},\n`;
    sql += `  ${formatArray(exercise.tags)},\n`;
    sql += `  '${exercise.author}',\n`;
    sql += `  '${exercise.base_branch}',\n`;
    sql += `  '${exercise.head_branch}',\n`;
    sql += `  ${formatArray(exercise.commonly_missed)}\n`;
    sql += `) on conflict (id) do nothing;\n\n`;

    // 2. Insert Files
    sql += `-- Exercise Files\n`;
    sql += `insert into public.exercise_files (id, exercise_id, path, additions, deletions, sort_order) values\n`;

    const fileUUIDs = files.map(() => generateUUID());

    const fileLines = files.map((f: any, i: number) => {
        return `  ('${fileUUIDs[i]}', '${exerciseId}', '${f.path}', ${f.additions}, ${f.deletions}, ${i})`;
    });

    sql += fileLines.join(",\n");
    sql += `\non conflict (id) do nothing;\n\n`;

    // 3. Insert Chunks
    files.forEach((f: any, fileIndex: number) => {
        if (f.chunks && f.chunks.length > 0) {
            f.chunks.forEach((chunk: any, chunkIndex: number) => {
                const chunkId = generateUUID();
                sql += `-- File ${fileIndex + 1} — ${f.path} chunk\n`;
                sql += `insert into public.file_chunks (id, file_id, header, lines, sort_order) values\n`;
                sql += `('${chunkId}', '${fileUUIDs[fileIndex]}', '${chunk.header}',\n`;
                // Convert to properly stringified JSONB
                const formattedJson = JSON.stringify(chunk.lines, null, 2).replace(/'/g, "''");
                sql += `'${formattedJson}'::jsonb, ${chunkIndex})\n`;
                sql += `on conflict (id) do nothing;\n\n`;
            });
        }
    });

    return sql;
}
