import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/jwt";

export const accessCookieName = "pawbase_access";

export async function getCurrentSession() {
  const token = cookies().get(accessCookieName)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
