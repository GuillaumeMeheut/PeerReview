"use client";

import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";

export const TourCard: React.FC<CardComponentProps> = ({
    step,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    arrow,
}) => {
    const { closeOnborda } = useOnborda();

    return (
        <div className="relative w-[320px] rounded-lg border border-border/50 bg-card p-4 shadow-lg">
            <button
                onClick={() => closeOnborda()}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">
                    {currentStep + 1} of {totalSteps}
                </span>
            </div>

            <h3 className="text-sm font-semibold mb-2">
                {step.icon && <>{step.icon} </>}{step.title}
            </h3>
            <div className="text-sm text-muted-foreground mb-4">
                {step.content}
            </div>

            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => closeOnborda()}
                    className="text-xs text-muted-foreground"
                >
                    Skip tour
                </Button>
                <div className="flex gap-2">
                    {currentStep !== 0 && (
                        <Button variant="outline" size="sm" onClick={() => prevStep()}>
                            Previous
                        </Button>
                    )}
                    {currentStep + 1 !== totalSteps ? (
                        <Button size="sm" onClick={() => nextStep()}>
                            Next
                        </Button>
                    ) : (
                        <Button size="sm" onClick={() => closeOnborda()}>
                            Finish
                        </Button>
                    )}
                </div>
            </div>

            {arrow}
        </div>
    );
};
