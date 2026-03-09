"use client";

import { useEffect, useState } from "react";
import { useOnborda } from "onborda";
import { Button } from "@workspace/ui/components/button";
import { HelpCircle, X } from "lucide-react";

const TOUR_SEEN_KEY = "review-tour-seen";

export function TourTrigger() {
    const { startOnborda } = useOnborda();
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem(TOUR_SEEN_KEY);
        if (!seen) {
            const timer = setTimeout(() => setShowPrompt(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleStart = () => {
        setShowPrompt(false);
        localStorage.setItem(TOUR_SEEN_KEY, "true");
        startOnborda("review-tour");
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem(TOUR_SEEN_KEY, "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-lg border border-border/50 bg-card p-4 shadow-lg max-w-[280px]">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                        <div>
                            <p className="text-sm font-medium">First time here?</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Take a quick tour to learn how code reviews work.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={handleDismiss}>
                        Skip
                    </Button>
                    <Button size="sm" className="flex-1 text-xs" onClick={handleStart}>
                        Start Tour
                    </Button>
                </div>
            </div>
        </div>
    );
}
