"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Code, MessageSquarePlus, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-16 selection:bg-primary/20">

            {/* Background gradients */}
            <div className="fixed inset-0 z-[-1] bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            </div>

            <main className="flex-1 flex flex-col items-center">

                {/* Hero Section */}
                <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col items-center"
                    >
                        <motion.div variants={fadeIn} className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-sm font-medium mb-8 text-muted-foreground">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Elevate your engineering skills
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl text-balance leading-tight md:leading-tight">
                            Master Code Review with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">AI Context</span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
                            Level up your skills. Browse pull requests, leave inline comments, and get instant, intelligent feedback on your review quality.
                        </motion.p>

                        <motion.div variants={fadeIn} className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button asChild size="lg" className="h-12 px-8 rounded-full text-base group">
                                <Link href="/problems">
                                    Start Reviewing
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full text-base bg-background/50 backdrop-blur-sm">
                                <Link href="/problems">
                                    Browse PRs
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Workflow / Features Section */}
                <section className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="flex flex-col items-center text-center mb-16"
                    >
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold tracking-tight">
                            How it works
                        </motion.h2>
                        <motion.p variants={fadeIn} className="mt-4 text-muted-foreground text-lg max-w-2xl">
                            A streamlined workflow designed to build your intuition and make you a better teammate.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative mt-16">
                        {/* Connecting line (Desktop) */}
                        <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                        <WorkflowStep
                            delay={0.1}
                            icon={<Code className="h-6 w-6 text-primary" />}
                            title="1. Browse & Filter PRs"
                            description="Filter by tech stack or framework. Find realistic pull requests that match your current stack or the one you want to learn."
                        />

                        <WorkflowStep
                            delay={0.2}
                            icon={<MessageSquarePlus className="h-6 w-6 text-primary" />}
                            title="2. Review and Comment"
                            description="Analyze the diffs. Leave inline comments pinpointing bugs, suggesting refactors, or noting security vulnerabilities just like on GitHub."
                        />

                        <WorkflowStep
                            delay={0.3}
                            icon={<Zap className="h-6 w-6 text-primary" />}
                            title="3. Get AI Feedback"
                            description="Submit your solution. Receive immediate, tailored AI feedback assessing the quality, tone, and accuracy of your review."
                        />
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="w-full border-t border-border/40 bg-muted/20">
                    <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-2 gap-12 md:gap-24 items-center"
                        >
                            <div>
                                <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                                    Why practice code reviews?
                                </motion.h2>
                                <div className="space-y-4">
                                    {[
                                        "Catch bugs before they reach production",
                                        "Learn best practices from diverse codebases",
                                        "Improve communication skills with peers",
                                        "Adapt to AI-assisted development environments"
                                    ].map((item, i) => (
                                        <motion.div key={i} variants={fadeIn} className="flex items-start gap-3">
                                            <div className="mt-1 bg-primary/20 p-1 rounded-full">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="text-lg text-muted-foreground">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <motion.div
                                variants={fadeIn}
                                className="relative rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 z-0" />
                                {/* Mockup visual */}
                                <div className="rounded-xl border border-border/50 bg-card p-6 relative z-10 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border/50">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                        </div>
                                        <div className="text-xs text-muted-foreground ml-2 font-mono">auth/route.ts</div>
                                    </div>
                                    <div className="font-mono text-sm space-y-1.5 opacity-80">
                                        <div className="text-red-400">- <span className="opacity-70">const token = req.headers.authorization;</span></div>
                                        <div className="text-green-400">+ <span className="opacity-70">const token = req.headers.authorization?.split(" ")[1];</span></div>
                                    </div>
                                    <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                                        <div className="text-sm font-medium flex items-center gap-2 mb-1 text-primary">
                                            <Zap className="h-3 w-3" />
                                            AI Feedback
                                        </div>
                                        <div className="text-sm text-foreground/80">
                                            Great catch on the missing optional chaining! Your comment was clear and polite.
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="flex flex-col items-center p-12 rounded-3xl border border-border/50 bg-card relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            Ready to master code review?
                        </motion.h2>
                        <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8 max-w-xl">
                            Join developers who are elevating their engineering careers by practicing reviews on real-world code.
                        </motion.p>
                        <motion.div variants={fadeIn}>
                            <Button asChild size="lg" className="h-12 px-8 rounded-full text-base">
                                <Link href="/problems">
                                    Get Started for Free
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} PeerReview. All rights reserved.</p>
            </footer>
        </div>
    );
}

function WorkflowStep({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay, duration: 0.5 } }
            } as Variants}
            className="flex flex-col items-center text-center relative z-10"
        >
            <div className="w-14 h-14 rounded-2xl bg-background border border-border/50 shadow-sm flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
