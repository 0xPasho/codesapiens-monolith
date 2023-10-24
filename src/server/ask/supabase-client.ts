import { createClient } from "@supabase/supabase-js";
import { env } from "~/env.mjs";
// Create a single supabase client for interacting with your database
export const supabaseClient = createClient(
  env.SUPABASE_URL || "",
  env.SUPABASE_KEY || "",
);
