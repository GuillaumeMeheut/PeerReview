import { getExercises } from "@/lib/supabase/queries"
import { HomeContent } from "@/components/home-content"
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

export const metadata: Metadata = {
    title: "Browse PRs",
    description: "Browse realistic pull requests to practice your code review skills.",
    openGraph: {
        title: "Browse Pull Request Exercises | PeerReview",
        description: "Browse realistic pull requests to practice your code review skills. Filter by stack and difficulty.",
        url: `${baseUrl}/problems`,
        images: [{ url: "/pr-list.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Browse Pull Request Exercises | PeerReview",
        description: "Browse realistic pull requests to practice your code review skills.",
        images: ["/pr-list.png"],
    },
    alternates: { canonical: `${baseUrl}/problems` },
};

//every 1 hour
export const revalidate = 3600

export default async function ProblemsPage() {
    const exercises = await getExercises()

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Background ambient accent */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
                {/* Hero — server-rendered for fast LCP */}
                <div className="relative z-10 mx-auto max-w-4xl text-center mb-16 space-y-6">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        Explore <span className="text-primary">Pull Requests</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Level up your code review skills by exploring and reviewing real-world code changes. Select your preferred tech stack and dive in.
                    </p>
                </div>

                {/* Interactive filter + grid — client boundary starts here */}
                <HomeContent pullRequests={exercises} />
            </div>
        </main>
    )
}
