import { getStripe } from "@/lib/stripe";
import { getUser } from "@/lib/supabase/queries";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { user } = await getUser();

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClientWithServiceRole();
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single();

    if (!sub?.stripe_customer_id) {
        return Response.json(
            { error: "No active subscription found." },
            { status: 400 }
        );
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const session = await getStripe().billingPortal.sessions.create({
        customer: sub.stripe_customer_id,
        return_url: `${origin}/premium`,
    });

    return Response.json({ url: session.url });
}
