import { NextResponse } from "next/server";
import { loginSchema } from "@pawbase/shared/schemas/auth";
import { comparePassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { accessCookieName } from "@/lib/auth/session";
import { findLoginUser } from "@/lib/auth/user-repository";

export async function POST(request: Request) {
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

  if (!user || !user.isActive || !passwordMatches) {
    return NextResponse.json(
      { error: "invalid_credentials", message: "Email or password is incorrect." },
      { status: 401 }
    );
  }

  const { passwordHash: _passwordHash, ...safeUser } = user;
  const token = await signSessionToken(safeUser);
  const response = NextResponse.json({ user: safeUser });

  response.cookies.set(accessCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    path: "/"
  });

  return response;
}
