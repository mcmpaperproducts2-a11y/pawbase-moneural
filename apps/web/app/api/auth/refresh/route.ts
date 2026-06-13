import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName, refreshCookieName } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { findLoginUser } from "@/lib/auth/user-repository";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshCookieName)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "no_refresh_token" }, { status: 401 });
  }

  try {
    const { sub: userId } = await verifyRefreshToken(refreshToken);
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
      const { data: session } = await supabase
        .from("user_sessions")
        .select("id, expires_at")
        .eq("user_id", userId)
        .eq("token_hash", tokenHash)
        .maybeSingle();

      if (!session || new Date(session.expires_at) < new Date()) {
        return NextResponse.json({ error: "session_expired" }, { status: 401 });
      }

      const { data: row } = await supabase
        .from("users")
        .select("email, is_active")
        .eq("id", userId)
        .maybeSingle<{ email: string; is_active: boolean | null }>();
      if (!row?.email || row.is_active === false) {
        return NextResponse.json({ error: "account_inactive" }, { status: 403 });
      }

      const user = await findLoginUser(row.email);
      if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 401 });
      const { passwordHash: _passwordHash, ...safeUser } = user;
      const accessToken = await signAccessToken(safeUser);
      const response = NextResponse.json({ ok: true });
      response.cookies.set(accessCookieName, accessToken, cookieOptions(60 * 15));
      response.cookies.set(legacyAccessCookieName, accessToken, cookieOptions(60 * 15));
      return response;
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_refresh_token" }, { status: 401 });
  }
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/"
  };
}
