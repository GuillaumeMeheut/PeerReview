import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/lib/supabase/queries";
import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@workspace/ui/components/button";

export async function Navbar() {
    const { user } = await getUser();

    return (
        <nav className="border-b border-border/50 bg-background">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src="/logo.png" alt="Logo" width={36} height={36} priority />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>PeerReview</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/problems" className="hover:text-foreground transition-colors">
                            Problems
                        </Link>
                        <Link href="/learn" className="hover:text-foreground transition-colors">
                            Learn
                        </Link>
                    </div>
                    {user ? (
                        <UserNav user={user} />
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Sign In
                            </Link>
                            <Button asChild size="sm">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
