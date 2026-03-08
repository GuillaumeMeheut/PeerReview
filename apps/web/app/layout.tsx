import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "@workspace/ui/globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
});

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
        images: [{ url: "/pr-list.png", width: 1200, height: 630, alt: "PeerReview — Practice Code Reviews with AI Feedback" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "PeerReview - Practice Code Reviews",
        description: "Practice code reviews and refactoring like in real teams.",
        images: ["/pr-list.png"],
    },
    alternates: { canonical: baseUrl },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} ${jetbrainsMono.variable} min-h-screen bg-background text-foreground antialiased`}
            >
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex flex-1 flex-col">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
