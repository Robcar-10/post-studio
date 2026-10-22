import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function isAdmin(userId: string): Promise<boolean> {
  if (!ADMIN_EMAILS.length) return false;
  const user = await currentUser();
  if (!user) return false;
  return user.emailAddresses.some((e) =>
    ADMIN_EMAILS.includes(e.emailAddress.toLowerCase())
  );
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await isAdmin(userId);

  const { data, error } = await supabaseAdmin
    .from("brand_kits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    brandKit: data
      ? { ...data, isPro: admin || (data.is_pro ?? false) }
      : admin
        ? { isPro: true }
        : null,
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const row = {
    user_id:         userId,
    business:        body.business        ?? "",
    location:        body.location        ?? "",
    what_we_do:      body.whatWeDo        ?? "",
    voice_lean:      body.voiceLean       ?? "friendly",
    use_phrases:     body.usePhrases      ?? [],
    avoid_phrases:   body.avoidPhrases    ?? [],
    sample_line:     body.sampleLine      ?? "",
    include_emoji:   body.includeEmoji    ?? true,
    cta_default:     body.ctaDefault      ?? "",
    color_primary:   body.colorPrimary    ?? "#B221F6",
    color_secondary: body.colorSecondary  ?? "#FF6452",
    logo_url:        body.logoUrl         ?? null,
    updated_at:      new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("brand_kits")
    .upsert(row, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
