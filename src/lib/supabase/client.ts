import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ywdndkmrhwwqjhpmvaml.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_f9ysyssX2WYiSo4nBBULEQ_CtRa2On-";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
