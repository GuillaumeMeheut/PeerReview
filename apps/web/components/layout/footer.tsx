import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full relative z-10 border-t border-border/40 py-6 text-center text-sm text-muted-foreground mt-auto bg-background">
            <p>&copy; {new Date().getFullYear()} PeerReview. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                </Link>
                <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                    Sitemap
                </Link>
            </div>
        </footer>
    );
}
