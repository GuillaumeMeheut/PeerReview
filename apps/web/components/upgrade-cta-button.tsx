"use client";

import { Button } from "@workspace/ui/components/button";
import posthog from "posthog-js";

export function UpgradeCtaButton() {
    const handleClick = () => {
        posthog.capture("upgrade_cta_clicked", {
            location: "homepage_premium_section",
        });
    };

    return (
        <Button size="lg" className="rounded-full px-8" onClick={handleClick}>
            Upgrade to Pro
        </Button>
    );
}
