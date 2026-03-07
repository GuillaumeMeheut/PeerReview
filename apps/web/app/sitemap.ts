import { MetadataRoute } from "next";
import { getExercises } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://peer-review.dev";

    // Static routes
    const routes = ["", "/problems", "/learn", "/premium", "/signup", "/signin"].map(
        (route) => ({
            url: `${baseUrl}${route}`,
            lastModified: new Date().toISOString(),
        })
    );

    // Dynamic routes
    let exercisesSitemap: MetadataRoute.Sitemap = [];
    try {
        const exercises = await getExercises();
        exercisesSitemap = exercises.map((pr) => ({
            url: `${baseUrl}/review/${pr.id}`,
            lastModified: pr.created_at ? new Date(pr.created_at).toISOString() : new Date().toISOString(),
        }));
    } catch (e) {
        console.error("Failed to fetch exercises for sitemap", e);
    }

    return [...routes, ...exercisesSitemap];
}
