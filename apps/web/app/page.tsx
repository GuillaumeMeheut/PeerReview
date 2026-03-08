import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: { canonical: "https://peer-review.dev" },
};
import Image from "next/image";
import { ArrowRight, Code, MessageSquarePlus, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { AnimatedBackground } from "@/components/animated-background";
import { GlowOrb } from "@/components/glow-orb";

export default function LandingPage() {
    return (
        <div className="min-h-screen text-foreground flex flex-col pt-16 selection:bg-primary/20 relative">

            {/* Animated Canvas Background */}
            <AnimatedBackground />

            {/* Glowing Orb behind Hero */}
            <div className="fixed inset-0 z-[0] pointer-events-none">
                <GlowOrb className="absolute left-0 right-0 top-0 m-auto h-[450px] w-[450px] bg-primary/20 opacity-40 blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center overflow-x-hidden relative z-10">

                {/* Hero Section */}
                <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center text-center relative z-10">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/80 border border-border/50 text-sm font-medium mb-8 text-muted-foreground backdrop-blur-md shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Elevate your engineering skills
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-balance leading-tight md:leading-tight">
                            Master Code Review with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">AI Context</span>
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
                            Level up your skills. Browse pull requests, leave inline comments, and get instant, intelligent feedback on your review quality.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button asChild size="lg" className="h-12 px-8 rounded-full text-base group relative overflow-hidden transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/30)]">
                                <Link href="/problems">
                                    <span className="relative z-10 flex items-center">
                                        Start Reviewing
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm transition-all hover:bg-muted/80 border-border/80 text-foreground">
                                <Link href="/problems">
                                    Browse PRs
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Workflow / Features Section (Dense Zig-Zag) */}
                <section className="w-full relative py-16 md:py-24 border-b border-border/40 overflow-hidden">

                    <div className="max-w-7xl mx-auto px-6 flex flex-col gap-20 lg:gap-24 relative z-10">
                        <div className="flex flex-col items-center text-center mb-4">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                A streamlined workflow
                            </h2>
                            <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
                                Everything you need to build your intuition and become a better engineer.
                            </p>
                        </div>

                        {/* Step 1: Browse PRs (Text Left, Image Right) */}
                        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
                            <div className="flex-1 space-y-5 relative">
                                <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-40 blur-[100px] bg-primary/10" />

                                <div className="hidden md:block absolute left-6 top-16 bottom-1 w-px bg-gradient-to-b from-border to-transparent -z-10" />
                                <h3 className="text-2xl md:text-3xl font-bold relative z-10">Browse & Filter PRs</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                                    Find realistic pull requests that match your current stack or the one you want to learn. Filter by framework, language, and difficulty to target exactly what you need to improve.
                                </p>
                                <div className="flex gap-2 flex-wrap pt-2 relative z-10">
                                    {["React", "Node.js", "Python", "Go"].map(tag => (
                                        <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-muted rounded-md text-muted-foreground border border-border/50">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-[1.5] relative w-full aspect-[16/10] rounded-2xl border border-border bg-card overflow-hidden shadow-xl group">
                                <Image
                                    src="/pr-list.png"
                                    alt="Pull request list interface"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.02]"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Step 2: Review and Comment (Image Left, Text Right) */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">
                            <div className="flex-1 space-y-5 relative">
                                <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-40 blur-[100px] bg-primary/10" />

                                <div className="hidden md:block absolute right-6 top-16 bottom-1 w-px bg-gradient-to-b from-border to-transparent -z-10" />
                                <h3 className="text-2xl md:text-3xl font-bold relative z-10">Review and Comment</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                                    Analyze the code diffs line by line. Leave inline comments pinpointing logic bugs, suggesting clean refactors, or noting security vulnerabilities just like you would on your team's real codebase.
                                </p>
                            </div>
                            <div className="flex-[1.5] relative w-full aspect-[16/10] rounded-2xl border border-border bg-card overflow-hidden shadow-xl group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent z-10 pointer-events-none" />
                                <Image
                                    src="/code-review.png"
                                    alt="Code review interface"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 60vw"
                                    className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </div>

                        {/* Step 3: AI Feedback (Vertical Stack: Text Top, Image Bottom) */}
                        <div className="flex flex-col items-center gap-8 pt-8 md:pt-12 relative">
                            <div className="max-w-3xl text-center space-y-4 flex flex-col items-center relative">
                                <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] opacity-30 blur-[100px] bg-primary/10" />
                                <h3 className="text-2xl md:text-3xl font-bold relative z-10">Get AI Feedback</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed text-balance relative z-10">
                                    Submit your review and receive immediate, tailored AI feedback. The system assesses the quality, tone, and accuracy of your comments, helping you graduate from junior syntax-checker to senior architect.
                                </p>
                            </div>
                            <div className="w-full max-w-4xl mx-auto relative border border-border bg-card rounded-[2rem] overflow-hidden shadow-2xl p-2 sm:p-4 mt-2">
                                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent z-10 pointer-events-none" />
                                <Image
                                    src="/ai-feedback.png"
                                    alt="AI Feedback interface"
                                    width={1600}
                                    height={2000}
                                    className="w-full h-auto rounded-xl border border-border/50 shadow-sm transition-transform duration-700 hover:scale-[1.01]"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                {/* Benefits Section (Denser Card Block) */}
                <section className="w-full py-16 md:py-24 relative z-10">
                    <div className="max-w-6xl mx-auto px-6 relative">
                        {/* Background glow for the section */}
                        <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-full opacity-60 bg-primary/10 blur-[120px]" />

                        <div className="bg-card/80 backdrop-blur-md border border-border rounded-3xl p-8 md:p-12 lg:p-16 shadow-lg flex flex-col lg:flex-row gap-12 items-start relative overflow-hidden">
                            <GlowOrb className="top-0 right-0 w-96 h-96 opacity-50 bg-primary/10 blur-[100px]" />

                            <div className="lg:w-1/3 space-y-4 relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
                                    Why practice code reviews?
                                </h2>
                                <p className="text-muted-foreground text-lg">
                                    Reviewing code is the fastest structural way to level up your engineering intuition outside of writing huge systems from scratch.
                                </p>
                            </div>

                            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                                {[
                                    { title: "Catch bugs before production", desc: "Train your eye to spot logical flaws and edge cases before they are merged." },
                                    { title: "Learn best practices", desc: "Expose yourself to diverse architectural patterns and clean code principles." },
                                    { title: "Improve communication", desc: "Learn how to give constructive, actionable feedback without being pedantic." },
                                    { title: "Adapt to AI", desc: "Understand how to work alongside AI tools to automate the mundane parts of review." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-2 relative group">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="bg-background rounded-full p-1 border border-border shadow-sm">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <h4 className="text-lg font-semibold">{item.title}</h4>
                                        </div>
                                        <p className="text-muted-foreground pl-10 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full max-w-5xl mx-auto px-6 py-24 mb-32 relative z-10">
                    <div className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-card leading-none flex flex-col items-center justify-center space-y-8 py-20 px-10 md:px-20 rounded-[3rem] border border-border/40 shadow-2xl backdrop-blur-3xl">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-center max-w-3xl">
                                Don't just write code.
                                <span className="text-primary block mt-2">Perfect it.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground text-center max-w-2xl leading-relaxed">
                                Join our community of developers sharpening their engineering eyes. Every review is a lesson in better architecture.
                            </p>
                            <Button asChild size="lg" className="h-16 px-12 rounded-2xl text-xl font-bold bg-primary hover:bg-primary/90 ">
                                <Link href="/problems">
                                    Start Learning Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
