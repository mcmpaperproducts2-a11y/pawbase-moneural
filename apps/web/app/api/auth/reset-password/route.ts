import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/)
});

export async function PATCH(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });

  const tokenHash = crypto.createHash("sha256").update(parsed.data.token).digest("hex");
  const { data: reset } = await supabase
    .from("password_resets")
    .select("id, user_id, expires_at, used")
    .eq("token_hash", tokenHash)
    .eq("used", false)
    .maybeSingle<{ id: string; user_id: string; expires_at: string; used: boolean }>();

  if (!reset || new Date(reset.expires_at) < new Date()) {
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await supabase.from("users").update({ password_hash: passwordHash }).eq("id", reset.user_id);
  await supabase.from("password_resets").update({ used: true }).eq("id", reset.id);
  await supabase.from("user_sessions").delete().eq("user_id", reset.user_id);

  return NextResponse.json({ ok: true });
}
