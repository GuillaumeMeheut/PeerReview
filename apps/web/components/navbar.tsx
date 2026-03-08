import Link from "next/link";
import Image from "next/image";
import { getUser, getUserSubscriptionById } from "@/lib/supabase/queries";
import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@workspace/ui/components/button";
import { MobileNav } from "@/components/mobile-nav";

export async function Navbar() {
    const { user } = await getUser();
    const subscription = user ? await getUserSubscriptionById(user.id) : null;

    return (
        <nav className="border-b border-border/50 bg-background relative">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src="/logo.png" alt="Logo" width={36} height={36} priority />
                    <span className="font-[family-name:var(--font-mono)]">PeerReview</span>
                </Link>

                {/* Desktop navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/explore" className="hover:text-foreground transition-colors">
                            Explore
                        </Link>
                    </div>
                    {user ? (
                        <UserNav user={user} subscription={subscription} />
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

                {/* Mobile navigation */}
                <div className="flex items-center gap-2 md:hidden">
                    {user && <UserNav user={user} subscription={subscription} />}
                    <MobileNav user={user} subscription={subscription} />
                </div>
            </div>
        </nav>
    );
}
