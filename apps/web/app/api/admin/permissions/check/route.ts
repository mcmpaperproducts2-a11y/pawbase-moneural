import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName } from "@/lib/auth/session";
import { checkPermission, type MatrixAction } from "@/lib/permissions/checker";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(accessCookieName)?.value ?? request.cookies.get(legacyAccessCookieName)?.value;
  if (!token) return NextResponse.json({ allowed: false });
  const session = await verifyAccessToken(token).catch(() => null);
  if (!session) return NextResponse.json({ allowed: false });
  const module = request.nextUrl.searchParams.get("module") ?? "";
  const action = (request.nextUrl.searchParams.get("action") ?? "can_view") as MatrixAction;
  return NextResponse.json({ allowed: await checkPermission(session.user, module, action) });
}
