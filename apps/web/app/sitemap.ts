import { MetadataRoute } from "next";
import { getExercises } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

    // Static routes with stable lastModified dates
    const routes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: "2026-03-08" },
        { url: `${baseUrl}/problems`, lastModified: "2026-03-08" },
        { url: `${baseUrl}/premium`, lastModified: "2026-03-08" },
        { url: `${baseUrl}/privacy`, lastModified: "2026-03-08" },
        { url: `${baseUrl}/terms`, lastModified: "2026-03-08" },
    ];

    // Dynamic routes
    let exercisesSitemap: MetadataRoute.Sitemap = [];
    try {
        const exercises = await getExercises();
        exercisesSitemap = exercises.flatMap((pr) => {
            const lastModified = pr.created_at ? new Date(pr.created_at).toISOString() : "2026-03-08";
            return [
                { url: `${baseUrl}/review/${pr.id}`, lastModified },
                { url: `${baseUrl}/review/${pr.id}/discussions`, lastModified },
                { url: `${baseUrl}/review/${pr.id}/solutions`, lastModified },
            ];
        });
    } catch (e) {
        console.error("Failed to fetch exercises for sitemap", e);
    }

    return [...routes, ...exercisesSitemap];
}
