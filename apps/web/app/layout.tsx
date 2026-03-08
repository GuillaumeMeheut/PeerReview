import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import "@workspace/ui/globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        template: "%s | PeerReview",
        default: "PeerReview - Practice Code Reviews",
    },
    description: "Practice code reviews and refactoring like in real teams. Improve your engineering skills with AI-assisted feedback on real-world pull requests.",
    openGraph: {
        title: "PeerReview - Practice Code Reviews",
        description: "Practice code reviews and refactoring like in real teams.",
        url: baseUrl,
        siteName: "PeerReview",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PeerReview - Practice Code Reviews",
        description: "Practice code reviews and refactoring like in real teams.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className="min-h-screen bg-background text-foreground antialiased"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex flex-1 flex-col">{children}</main>
                        <footer className="w-full relative z-10 border-t border-border/40 py-6 text-center text-sm text-muted-foreground mt-auto bg-background">
                            <p>© {new Date().getFullYear()} PeerReview. All rights reserved.</p>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
