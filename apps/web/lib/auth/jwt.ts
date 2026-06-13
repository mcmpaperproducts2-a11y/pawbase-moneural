import { SignJWT, jwtVerify } from "jose";
import type { AuthUser, SessionPayload } from "@/types/domain";

const encoder = new TextEncoder();

function getJwtSecret() {
  return encoder.encode(process.env.JWT_SECRET ?? "dev-only-pawbase-secret-change-before-production");
}

export async function signSessionToken(user: AuthUser) {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getJwtSecret());
}

export async function signAccessToken(user: AuthUser) {
  return signSessionToken(user);
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ sub: userId, typ: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const user = payload.user as AuthUser | undefined;
    if (!user || !user.isActive) {
      return null;
    }
    return {
      user,
      exp: typeof payload.exp === "number" ? payload.exp : 0
    };
  } catch {
    return null;
  }
}

export async function verifyAccessToken(token: string) {
  const session = await verifySessionToken(token);
  if (!session) {
    throw new Error("invalid_access_token");
  }
  return session;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  if (payload.typ !== "refresh" || !payload.sub) {
    throw new Error("invalid_refresh_token");
  }
  return { sub: String(payload.sub), exp: typeof payload.exp === "number" ? payload.exp : 0 };
}
