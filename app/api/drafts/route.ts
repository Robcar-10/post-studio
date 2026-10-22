import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("drafts")
    .select("id, name, thumb, is_autosave, created_at, updated_at, project")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drafts: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const now = new Date().toISOString();

  const row = {
    id:          body.id,
    user_id:     userId,
    name:        body.name        ?? "Untitled",
    project:     body.project,
    thumb:       body.thumb       ?? null,
    is_autosave: body.isAutosave  ?? false,
    updated_at:  now,
  };

  const { error } = await supabaseAdmin
    .from("drafts")
    .upsert(row, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
