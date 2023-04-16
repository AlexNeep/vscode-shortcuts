import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://obdibeyrxzenilsaiqqq.supabase.co",
  process.env.SUPABASE_ANON_KEY ?? ""
);
