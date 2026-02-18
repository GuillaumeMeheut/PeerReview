import { cache } from "react";
import { createClient } from "./server";

// type SupabaseClient = ReturnType<typeof createClient>;

export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
});

// export const addProject = cache(
//   async (
//     supabase: SupabaseClient,
//     project: ProjectsInsert
//   ): Promise<string> => {
//     const { data, error } = await supabase
//       .from("projects")
//       .insert(project)
//       .select("id")
//       .single();

//     if (error) {
//       console.log("Error adding project:", error);
//       if (error.code === "23505") {
//         throw new Error("Project with this base URL already exists");
//       }
//       throw new Error("Error adding project");
//     }

//     return data.id;
//   }
// );

