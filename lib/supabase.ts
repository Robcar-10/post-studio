import { createClient } from "@supabase/supabase-js";

// Service-role client — server-side only, never exposed to the browser.
// All DB access is gated by Clerk userId checked in the API route layer.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
