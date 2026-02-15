import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { ArrowRight, CheckCircle2, Code2, Cpu, GitPullRequest, Laptop, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/20 bg-primary/5 text-primary rounded-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Zap className="w-3.5 h-3.5 mr-2 fill-current" />
                        New: AI-Powered Code Analysis
                    </Badge>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Master the Art of <br className="hidden md:block" />
                        <span className="text-foreground">Code Review</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                        Practice reviewing real-world code changes. Get instant feedback from AI conformant to industry standards. Level up your engineering skills today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/problems">
                            <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12 rounded-full">
                                Start Reviewing
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-12 rounded-full border-primary/20 hover:bg-primary/5">
                                How it Works
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-16 md:mt-24 w-full max-w-5xl mx-auto rounded-xl border border-border/50 bg-background/50 shadow-2xl backdrop-blur-sm overflow-hidden aspect-[16/9] relative group">
                        {/* Placeholder for Hero Image/Demo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
                            <div className="text-center space-y-2">
                                <Laptop className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="font-medium">Interactive Demo Placeholder</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />
            </section>

            {/* Value Proposition Section */}
            <section className="py-20 bg-muted/30 border-y border-border/50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Code Review Matters</h2>
                        <p className="text-muted-foreground text-lg">
                            In the age of AI-generated code, the ability to read, understand, and verify code is more valuable than writing it.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <CardTitle>Quality Assurance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    AI writes code fast, but often with subtle bugs. Humans are the final gatekeepers of correctness, security, and maintainability.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 text-green-500">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <CardTitle>AI Collaboration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Learn to work alongside AI. Review AI-generated pull requests and identify hallucinations or inefficient logic patterns.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <CardTitle>Career Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    Senior engineers spend 50% of their time reviewing code. Master this skill to accelerate your promotion path.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features / Process Section */}
            <section id="how-it-works" className="py-24">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">
                        <Badge variant="secondary" className="mb-4">How it Works</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Learn by Doing</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Our platform simulates a real-world engineering environment. No tutorials—just real code, real diffs, and real feedback.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                        <div className="flex flex-col items-center text-center relative">
                            <div className="w-24 h-24 rounded-2xl bg-background border-2 border-border shadow-lg flex items-center justify-center mb-6 z-10">
                                <GitPullRequest className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Analyze the PR</h3>
                            <p className="text-muted-foreground mb-6">
                                Examine the diff, context, and description. Identify bugs, security issues, and style violations.
                            </p>
                            <div className="w-full h-40 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                                PR Interface Placeholder
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center relative">
                            <div className="w-24 h-24 rounded-2xl bg-background border-2 border-border shadow-lg flex items-center justify-center mb-6 z-10">
                                <MessageSquare className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Submit Review</h3>
                            <p className="text-muted-foreground mb-6">
                                Write clear, actionable comments. Approve or request changes just like in a real team.
                            </p>
                            <div className="w-full h-40 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                                Review Form Placeholder
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center relative">
                            <div className="w-24 h-24 rounded-2xl bg-background border-2 border-border shadow-lg flex items-center justify-center mb-6 z-10">
                                <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Compare & Improve</h3>
                            <p className="text-muted-foreground mb-6">
                                Compare your review with standard answers and community submissions. See what you missed.
                            </p>
                            <div className="w-full h-40 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                                Comparison View Placeholder
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium AI Feedback Section */}
            <section className="py-24 bg-primary/5 rounded-3xl mx-4 md:mx-6 mb-12">
                <div className="container px-4 md:px-6 mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center rounded-lg bg-background/50 border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
                            <Zap className="mr-2 h-4 w-4 fill-current" />
                            Premium Feature
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold">Personalized AI Feedback</h2>
                        <p className="text-lg text-muted-foreground">
                            Get instant, detailed feedback on your review style, tone, and coverage. Our AI analyzes your comments to help you write more effective, empathetic, and impactful reviews.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {[
                                "Tone analysis (Aggressive vs Constructive)",
                                "Missed critical bugs identification",
                                "Suggestions for clearer explanations",
                                "Code snippet improvement recommendations"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-6">
                            <Button size="lg" className="rounded-full px-8">Upgrade to Pro</Button>
                        </div>
                    </div>
                    {/* AI Features Visual Placeholder */}
                    <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full bg-background rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col">
                        <div className="bg-muted/30 border-b border-border p-4 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            <div className="ml-4 h-6 w-64 bg-muted/50 rounded-md" />
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                            {/* Simulated Chat / Feedback UI */}
                            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-primary fill-current" />
                                </div>
                                <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl rounded-tl-none max-w-[85%]">
                                    <p className="text-sm font-medium text-foreground mb-1">AI Feedback Bot</p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Great catch on the memory leak! However, your comment regarding the variable naming could be phrased more constructively. Instead of "Fix this naming," try "Could we update this variable name to be more descriptive?"
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5 text-primary fill-current" />
                                </div>
                                <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl rounded-tl-none max-w-[85%]">
                                    <p className="text-sm font-medium text-foreground mb-1">Score: 8/10</p>
                                    <div className="mt-2 h-2 w-full bg-background rounded-full overflow-hidden">
                                        <div className="h-full w-[80%] bg-primary rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to improve your code reviews?</h2>
                <Link href="/problems">
                    <Button size="lg" className="px-10 h-14 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                        Get Started for Free
                    </Button>
                </Link>
            </section>

        </div>
    );
}
