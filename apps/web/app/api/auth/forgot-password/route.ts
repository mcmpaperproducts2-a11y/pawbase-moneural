import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authLimiter } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendPasswordResetEmail } from "@/lib/notifications/email";

const schema = z.object({ email: z.string().email().transform((value) => value.toLowerCase().trim()) });

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limited = await authLimiter.limit(`reset:${ip}`);
  if (!limited.success) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_email" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ ok: true });

  const { data: user } = await supabase
    .from("users")
    .select("id, email, full_name, name")
    .eq("email", parsed.data.email)
    .maybeSingle<{ id: string; email: string; full_name?: string | null; name?: string | null }>();

  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await supabase.from("password_resets").insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    used: false
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  await sendPasswordResetEmail({
    to: user.email,
    name: user.full_name ?? user.name ?? user.email,
    resetUrl: `${baseUrl}/reset-password?token=${token}`
  });

  return NextResponse.json({ ok: true });
}
