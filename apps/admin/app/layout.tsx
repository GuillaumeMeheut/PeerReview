import "@workspace/ui/globals.css"
import { Toaster } from "sonner";

export const metadata = {
    title: "Admin Tools",
    description: "Internal tools for PeerReview",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen">
                {children}
                <Toaster />
            </body>
        </html>
    );
}
