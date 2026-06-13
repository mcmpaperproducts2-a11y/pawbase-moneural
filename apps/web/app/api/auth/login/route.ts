import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@pawbase/shared/schemas/auth";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName, refreshCookieName } from "@/lib/auth/session";
import { findLoginUser } from "@/lib/auth/user-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { authLimiter } from "@/lib/rate-limit";
import { log } from "@/lib/monitoring/logger";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "anon";
  const limited = await authLimiter.limit(`login:${ip}`);
  if (!limited.success) {
    log("warn", "auth.login.rate_limited", { ip });
    return NextResponse.json({ error: "rate_limited", message: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", message: "Enter a valid email and password." },
      { status: 400 }
    );
  }

  const user = await findLoginUser(parsed.data.email);
  const passwordHash = user?.passwordHash ?? "$2a$12$C77PKwBRPHhp38OWg5FxNuto0S0mVvrWGiQBDihRh6uYPVrxQFBFu";
  const passwordMatches = await comparePassword(parsed.data.password, passwordHash);

  if (!user || !passwordMatches) {
    log("warn", "auth.login.invalid_credentials", { email: parsed.data.email, ip });
    return NextResponse.json(
      { error: "invalid_credentials", message: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  if (!user.isActive) {
    return NextResponse.json(
      { error: "account_inactive", message: "Account is deactivated. Contact your administrator." },
      { status: 403 }
    );
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  const token = await signAccessToken(safeUser);
  const refreshToken = await signRefreshToken(safeUser.id);
  const response = NextResponse.json({ user: safeUser });
  const refreshMaxAge = (parsed.data.rememberMe ? 30 : 7) * 86400;

  const supabase = createServerSupabaseClient();
  if (supabase) {
    const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await supabase.from("user_sessions").insert({
      user_id: safeUser.id,
      token_hash: tokenHash,
      ip_address: ip,
      user_agent: request.headers.get("user-agent") ?? "",
      expires_at: new Date(Date.now() + refreshMaxAge * 1000).toISOString()
    });
    await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", safeUser.id);
  }

  response.cookies.set(accessCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    path: "/"
  });
  response.cookies.set(legacyAccessCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    path: "/"
  });
  response.cookies.set(refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshMaxAge,
    path: "/"
  });

  return response;
}
