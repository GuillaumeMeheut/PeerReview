import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign In - PeerReview",
    description: "Sign in to your PeerReview account",
};

export default function SignInPage() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Or{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-primary hover:text-primary/90"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>
                <OAuthButtons />
            </div>
        </div>
    );
}
