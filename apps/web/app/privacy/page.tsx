import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "PeerReview privacy policy — how we collect, use, and protect your data.",
    alternates: { canonical: `${baseUrl}/privacy` },
    robots: { index: true, follow: true },
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-sm">
            <h1>Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: March 8, 2026</p>

            <h2>1. Information We Collect</h2>
            <p>
                When you create an account on PeerReview, we collect your name, email address, and profile
                information provided through your authentication provider (GitHub or Google). We also collect
                usage data such as exercises attempted, reviews submitted, and AI feedback requested.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Provide, maintain, and improve our code review practice platform</li>
                <li>Generate AI-powered feedback on your code reviews</li>
                <li>Process payments and manage your subscription</li>
                <li>Send transactional emails related to your account</li>
                <li>Analyze usage patterns to improve the platform</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>
                Your data is stored securely using Supabase (PostgreSQL) with row-level security policies.
                All data is transmitted over HTTPS. We do not sell your personal information to third parties.
            </p>

            <h2>4. Cookies and Analytics</h2>
            <p>
                We use PostHog for product analytics to understand how users interact with PeerReview.
                We use essential cookies for authentication and session management. You can control cookie
                preferences through your browser settings.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>We share data with the following third-party services as necessary to operate PeerReview:</p>
            <ul>
                <li><strong>Supabase</strong> — database and authentication</li>
                <li><strong>Stripe</strong> — payment processing</li>
                <li><strong>OpenAI</strong> — AI feedback generation (review content only, not personal data)</li>
                <li><strong>PostHog</strong> — product analytics</li>
                <li><strong>Cloudflare</strong> — hosting and CDN</li>
            </ul>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent for data processing at any time</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
                We retain your data for as long as your account is active. If you delete your account,
                we will remove your personal data within 30 days, except where retention is required by law.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
                PeerReview is not intended for use by children under 16. We do not knowingly collect
                personal information from children under 16.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
                We may update this privacy policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

        </div>
    );
}
