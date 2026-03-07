"use client";

import { motion, Variants } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Infinity, ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const freeTierFeatures = [
    "3 AI review credits per month",
    "Access to all exercises",
    "Community discussions",
    "Submit solutions",
];

const proTierFeatures = [
    "Unlimited AI reviews",
    "Access to all exercises",
    "Community discussions",
    "Submit solutions",
    "Priority support",
];

export function PremiumPageContent() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const success = searchParams.get("success") === "true";
    const canceled = searchParams.get("canceled") === "true";

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            const data: { error?: string; url?: string } = await res.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-8 selection:bg-primary/20">
            {/* Background */}
            <div className="fixed inset-0 z-[-1] bg-background">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-1/2 -translate-x-1/2 top-0 -z-10 h-[400px] w-[600px] rounded-full bg-primary/15 opacity-30 blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center px-6">
                {/* Back link */}
                <div className="w-full max-w-5xl mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>

                {/* Success / Cancel banners */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl mb-8 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-center"
                    >
                        <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Welcome to PeerReview Pro! Your subscription is now active.
                        </p>
                    </motion.div>
                )}

                {canceled && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl mb-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-center"
                    >
                        <p className="text-yellow-400 font-medium">
                            Payment was canceled. You can try again anytime.
                        </p>
                    </motion.div>
                )}

                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <motion.div
                        variants={fadeIn}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium mb-6 text-indigo-400"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Upgrade your experience
                    </motion.div>

                    <motion.h1
                        variants={fadeIn}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Choose your plan
                    </motion.h1>

                    <motion.p
                        variants={fadeIn}
                        className="text-lg text-muted-foreground max-w-xl"
                    >
                        Unlock unlimited AI-powered code review feedback and
                        accelerate your engineering growth.
                    </motion.p>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 gap-8 w-full max-w-3xl mb-24"
                >
                    {/* Free Tier */}
                    <motion.div
                        variants={fadeIn}
                        className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 flex flex-col"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-1">Free</h3>
                            <p className="text-sm text-muted-foreground">
                                Get started with code review practice
                            </p>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold">€0</span>
                            <span className="text-muted-foreground ml-1">/month</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {freeTierFeatures.map((feature, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 text-sm text-muted-foreground"
                                >
                                    <Check className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full rounded-xl"
                            asChild
                        >
                            <Link href="/problems">Continue Free</Link>
                        </Button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div
                        variants={fadeIn}
                        className="relative rounded-2xl border-2 border-indigo-500/40 bg-card/80 backdrop-blur-sm p-8 flex flex-col overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />

                        {/* Popular badge */}
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold text-indigo-400">
                                Popular
                            </span>
                        </div>

                        <div className="relative mb-6">
                            <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-400" />
                                Pro
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Unlimited AI feedback and priority support
                            </p>
                        </div>

                        <div className="relative mb-8">
                            <span className="text-4xl font-bold">€4.99</span>
                            <span className="text-muted-foreground ml-1">/month</span>
                        </div>

                        <ul className="relative space-y-3 mb-8 flex-1">
                            {proTierFeatures.map((feature, i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <div className="bg-indigo-500/20 rounded-full p-0.5">
                                        <Check className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Button
                            size="lg"
                            className="relative w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Redirecting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Upgrade to Pro
                                </span>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Trust Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="w-full max-w-3xl mb-24"
                >
                    <motion.div
                        variants={fadeIn}
                        className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 grid md:grid-cols-3 gap-8"
                    >
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Infinity className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-semibold">Unlimited AI Reviews</h4>
                            <p className="text-sm text-muted-foreground">
                                Get detailed feedback on every code review you submit, with no limits.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-semibold">Priority Support</h4>
                            <p className="text-sm text-muted-foreground">
                                Get help faster. Premium members receive priority responses.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-semibold">Support Development</h4>
                            <p className="text-sm text-muted-foreground">
                                Help us build more exercises, features, and keep PeerReview free for everyone.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
