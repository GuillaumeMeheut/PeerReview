"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { OAuthButtons } from "./oauth-buttons";

import { usePathname } from "next/navigation";

interface LoginModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    redirectUrl?: string;
}

export function LoginModal({
    isOpen,
    onOpenChange,
    title = "Sign in to continue",
    description = "You need to be signed in to access this feature.",
    redirectUrl,
}: LoginModalProps) {
    const pathname = usePathname();
    const next = redirectUrl || pathname;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <OAuthButtons nextUrl={next} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
