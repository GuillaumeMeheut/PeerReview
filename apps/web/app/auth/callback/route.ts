import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPostHogClient } from "@/lib/posthog-server";


export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${requestUrl.origin}/signin`,
      );
    }

    // Track auth callback completion and identify user server-side
    if (data.user) {
      const posthog = getPostHogClient();
      posthog.identify({
        distinctId: data.user.id,
        properties: {
          email: data.user.email,
          name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          provider: data.user.app_metadata?.provider,
        },
      });
      posthog.capture({
        distinctId: data.user.id,
        event: "auth_callback_completed",
        properties: {
          provider: data.user.app_metadata?.provider,
          is_new_user: data.user.created_at === data.user.updated_at,
        },
      });
    }
  }

  const next = requestUrl.searchParams.get("next");

  // URL to redirect to after sign in process completes
  if (next) {
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  return NextResponse.redirect(`${requestUrl.origin}/problems`);
}
