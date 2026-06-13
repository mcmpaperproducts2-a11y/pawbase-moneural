import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/jwt";

export const accessCookieName = "access_token";
export const legacyAccessCookieName = "pawbase_access";
export const refreshCookieName = "refresh_token";

export async function getCurrentSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(accessCookieName)?.value ?? cookieStore.get(legacyAccessCookieName)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
