import { stripe } from "@/lib/stripe";
import { getUser, getUserSubscription } from "@/lib/supabase/queries";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { user } = await getUser();

    if (!user) {
        return Response.json(
            { error: "You must be logged in to upgrade." },
            { status: 401 }
        );
    }

    // Check if already premium
    const subscription = await getUserSubscription();
    if (subscription?.isPremium) {
        return Response.json(
            { error: "You are already a premium member." },
            { status: 400 }
        );
    }

    // Get or create Stripe customer
    const supabase = createServerSupabaseClientWithServiceRole();
    const { data: sub } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .single();

    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;

        await supabase
            .from("subscriptions")
            .update({ stripe_customer_id: customerId })
            .eq("user_id", user.id);
    }

    // Create Checkout Session
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID!,
                quantity: 1,
            },
        ],
        metadata: { supabase_user_id: user.id },
        success_url: `${origin}/premium?success=true`,
        cancel_url: `${origin}/premium?canceled=true`,
        subscription_data: {
            metadata: { supabase_user_id: user.id },
        },
    });

    return Response.json({ url: session.url });
}
