import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName, refreshCookieName } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshCookieName)?.value;
  if (refreshToken) {
    try {
      const { sub: userId } = await verifyRefreshToken(refreshToken);
      const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
      const supabase = createServerSupabaseClient();
      if (supabase) {
        await supabase.from("user_sessions").delete().eq("user_id", userId).eq("token_hash", tokenHash);
      }
    } catch {
      // Always clear cookies even when the refresh token is already invalid.
    }
  }

  const response = NextResponse.json({ ok: true });
  for (const name of [accessCookieName, legacyAccessCookieName, refreshCookieName]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/"
    });
  }
  return response;
}
