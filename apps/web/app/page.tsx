import { pullRequests } from "@/lib/mock-data";
import { PRCard } from "@/components/pr-card";
import { GitPullRequest } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-border/50">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-foreground">
                            <GitPullRequest className="h-4 w-4 text-background" />
                        </div>
                        <h1
                            className="text-xl font-semibold tracking-tight"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            PeerReview
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                        Practice code reviews and refactoring like in real teams
                    </p>
                </div>
            </header>

            {/* PR Grid */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Pull Requests
                    </h2>
                    <span className="text-xs text-muted-foreground/60">
                        {pullRequests.length} available
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pullRequests.map((pr) => (
                        <PRCard key={pr.id} pr={pr} />
                    ))}
                </div>
            </main>
        </div>
    );
}
