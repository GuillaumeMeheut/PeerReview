import type { PostgrestError } from "@supabase/supabase-js";

export function handleQueryError(
  error: PostgrestError | null,
  { context, ignorePGRST116 = false }: { context: string; ignorePGRST116?: boolean }
): boolean {
  if (!error) return false;
  if (ignorePGRST116 && error.code === "PGRST116") return true;
  console.error(`Error ${context}:`, error);
  return true;
}
