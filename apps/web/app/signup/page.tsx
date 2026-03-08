import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Metadata } from "next";
import Link from "next/link";

import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Sign Up - PeerReview",
    description: "Create your PeerReview account",
    robots: { index: false, follow: false },
};

export default function SignUpPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="font-medium text-primary hover:text-primary/90"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
                <Suspense fallback={<div />}>
                    <OAuthButtons />
                </Suspense>
            </div>
        </div>
    );
}
