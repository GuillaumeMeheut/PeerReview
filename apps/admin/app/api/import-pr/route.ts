import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json() as { url: string };
        const { url } = body;

        // 1. Extract owner, repo, and pull_number from URL
        // e.g. https://github.com/guillaumemeheut/PeerReview/pull/1
        const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
        if (!match) {
            return NextResponse.json({ error: "Invalid GitHub PR URL" }, { status: 400 });
        }

        const [, owner, repo, pull_number] = match;

        // Optional: Use GITHUB_TOKEN if rate limited
        const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PeerReview-App",
        };

        if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        }

        // 2. Fetch PR metadata
        const prRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
            { headers }
        );

        if (!prRes.ok) {
            const errorData = await prRes.json() as any;
            return NextResponse.json(
                { error: `Failed to fetch PR: ${errorData.message || prRes.statusText}` },
                { status: prRes.status }
            );
        }

        const prData = await prRes.json();
        // 3. Fetch PR diff
        const diffRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
            {
                headers: {
                    ...headers,
                    Accept: "application/vnd.github.v3.diff",
                },
            }
        );

        if (!diffRes.ok) {
            return NextResponse.json(
                { error: "Failed to fetch PR diff" },
                { status: diffRes.status }
            );
        }

        const diffText = await diffRes.text();

        // 4. Parse the Diff
        const parsedData = parseDiff(diffText, prData);

        return NextResponse.json(parsedData);
    } catch (error: any) {
        console.error("Error importing PR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process PR" },
            { status: 500 }
        );
    }
}

function parseDiff(diffText: string, prData: any) {
    // A crude but effective diff parser for the specific format we need
    const files: any[] = [];
    let currentFile: any = null;
    let currentChunk: any = null;

    let oldLineNum = 0;
    let newLineNum = 0;

    const lines = diffText.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (typeof line !== "string") continue;

        if (line.startsWith("diff --git")) {
            // New file starts
            if (currentFile) files.push(currentFile);

            const fileMatch = line.match(/diff --git a\/(.+) b\/(.+)/);
            const filePath = fileMatch ? fileMatch[2] : "unknown_file";

            currentFile = {
                path: filePath,
                additions: 0,
                deletions: 0,
                chunks: [],
            };
            currentChunk = null;
            continue;
        }

        if (!currentFile) continue;

        if (line.startsWith("index ") || line.startsWith("new file ") || line.startsWith("deleted file ")) {
            continue;
        }

        if (line.startsWith("--- ") || line.startsWith("+++ ")) {
            continue;
        }

        if (line.startsWith("@@ ")) {
            // New chunk starts
            const headerMatch = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/);
            if (headerMatch) {
                oldLineNum = parseInt(headerMatch[1] ?? '0', 10);
                newLineNum = parseInt(headerMatch[2] ?? '0', 10);
            }

            currentChunk = {
                header: line,
                lines: [],
            };
            currentFile.chunks.push(currentChunk);
            continue;
        }

        if (!currentChunk) continue;

        // Parse the actual changes
        if (line.startsWith("+")) {
            currentChunk.lines.push({
                type: "added",
                content: line.substring(1), // Remove the '+'
                oldLineNumber: null,
                newLineNumber: newLineNum++,
            });
            currentFile.additions++;
        } else if (line.startsWith("-")) {
            currentChunk.lines.push({
                type: "removed",
                content: line.substring(1), // Remove the '-' mark
                oldLineNumber: oldLineNum++,
                newLineNumber: null,
            });
            currentFile.deletions++;
        } else if (line.startsWith(" ")) {
            // Unchanged line
            currentChunk.lines.push({
                type: "unchanged",
                content: line.substring(1), // Remove the space
                oldLineNumber: oldLineNum++,
                newLineNumber: newLineNum++,
            });
        } else if (line === "\\ No newline at end of file") {
            // ignore
            continue;
        } else if (line === "") {
            // empty context line (sometimes diffs omit the leading space for purely empty lines)
            currentChunk.lines.push({
                type: "unchanged",
                content: "",
                oldLineNumber: oldLineNum++,
                newLineNumber: newLineNum++,
            });
        }
    }

    if (currentFile) {
        files.push(currentFile);
    }

    // Construct the Exercise Object
    const exercise = {
        title: prData.title,
        description: prData.body ? `${prData.body}\n\nOriginal PR: ${prData.html_url}` : `Original PR: ${prData.html_url}`,
        difficulty: "Mid", // Default
        tech_stack: [],
        tags: [],
        author: prData.user?.login || "github-user",
        base_branch: prData.base?.ref || "main",
        head_branch: prData.head?.ref || "feature",
        commonly_missed: []
    };

    return {
        exercise,
        files
    };
}
