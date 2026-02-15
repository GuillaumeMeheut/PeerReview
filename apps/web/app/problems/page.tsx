
"use client"

import { pullRequests } from "@/lib/mock-data"
import { HomeContent } from "@/components/home-content"

export default function ProblemsPage() {
    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <HomeContent pullRequests={pullRequests} />
        </div>
    )
}
