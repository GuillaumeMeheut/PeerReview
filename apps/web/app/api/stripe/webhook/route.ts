import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClientWithServiceRole } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return new Response("Missing stripe-signature header", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = getStripe().webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createServerSupabaseClientWithServiceRole();

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.supabase_user_id;

            // session.subscription can be a string ID or a Subscription object
            const subscriptionId =
                typeof session.subscription === "string"
                    ? session.subscription
                    : session.subscription?.id ?? null;

            if (!userId) {
                // Fallback: find user by Stripe customer ID
                const customerId = session.customer as string;
                const { data: sub } = await supabase
                    .from("subscriptions")
                    .select("user_id")
                    .eq("stripe_customer_id", customerId)
                    .single();

                if (sub) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            is_premium: true,
                            stripe_subscription_id: subscriptionId,
                            premium_since: new Date().toISOString(),
                        })
                        .eq("user_id", sub.user_id);
                }
            } else {
                await supabase
                    .from("subscriptions")
                    .update({
                        is_premium: true,
                        stripe_subscription_id: subscriptionId,
                        premium_since: new Date().toISOString(),
                    })
                    .eq("user_id", userId);
            }

            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const subscriptionId = subscription.id;

            await supabase
                .from("subscriptions")
                .update({
                    is_premium: false,
                    stripe_subscription_id: null,
                })
                .eq("stripe_subscription_id", subscriptionId);

            break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.supabase_user_id;
            const isActive =
                subscription.status === "active" ||
                subscription.status === "trialing";

            if (userId) {
                await supabase
                    .from("subscriptions")
                    .update({
                        is_premium: isActive,
                        stripe_subscription_id: subscription.id,
                        ...(isActive
                            ? { premium_since: new Date().toISOString() }
                            : {}),
                    })
                    .eq("user_id", userId);
            } else {
                // Fallback: find user by subscription ID
                await supabase
                    .from("subscriptions")
                    .update({
                        is_premium: isActive,
                        ...(isActive
                            ? { premium_since: new Date().toISOString() }
                            : {}),
                    })
                    .eq("stripe_subscription_id", subscription.id);
            }

            break;
        }

        default:
            // Unhandled event type — just acknowledge
            break;
    }

    return new Response("OK", { status: 200 });
}
