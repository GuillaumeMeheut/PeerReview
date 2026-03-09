import { cache } from "react";
import { createClient } from "../server";
import { handleQueryError } from "./utils";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

export const getUserSubscription = cache(async () => {
  const { user } = await getUser();
  if (!user) return null;
  return getUserSubscriptionById(user.id);
});

export const getUserSubscriptionById = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("is_premium, credits")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    if (handleQueryError(error, { context: "fetching user subscription" })) {
      return null;
    }
  }

  return {
    isPremium: data?.is_premium ?? false,
    credits: data?.credits ?? 0,
  };
});
