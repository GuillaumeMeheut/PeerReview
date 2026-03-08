"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { UserNav, type UserSubscription } from "@/components/auth/user-nav";
import type { User } from "@supabase/supabase-js";

interface MobileNavProps {
    user: User | null;
    subscription: UserSubscription | null;
}

export function MobileNav({ user, subscription }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle menu"
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-16 z-50 border-b border-border/50 bg-background shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col gap-1 px-6 py-4">
                        <Link
                            href="/problems"
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            Problems
                        </Link>
                        {!user && (
                            <>
                                <div className="my-2 border-t border-border/50" />
                                <Link
                                    href="/signin"
                                    onClick={() => setOpen(false)}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                >
                                    Sign In
                                </Link>
                                <div className="px-3 pt-1">
                                    <Button asChild size="sm" className="w-full">
                                        <Link href="/signup" onClick={() => setOpen(false)}>
                                            Sign Up
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
