import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import "@workspace/ui/globals.css";

export const metadata: Metadata = {
    title: "PeerReview",
    description: "Practice code reviews and refactoring like in real teams",
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
                    </div>
                </Providers>
            </body>
        </html>
    );
}
