"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";

export function UpgradeButton() {
    const [loading, setLoading] = useState(false);

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
    );
}
