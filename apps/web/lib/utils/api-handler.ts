import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName } from "@/lib/auth/session";
import { checkPermission, type MatrixAction } from "@/lib/permissions/checker";
import type { PermissionAction } from "@pawbase/shared/constants/modules";
import type { AuthUser } from "@/types/domain";

type WithAuthOptions = {
  module: string;
  action: PermissionAction | MatrixAction;
  handler: (request: NextRequest, context: { userId: string; user: AuthUser }) => Promise<Response> | Response;
};

export async function withAuth(request: NextRequest, options: WithAuthOptions) {
  const token = request.cookies.get(accessCookieName)?.value ?? request.cookies.get(legacyAccessCookieName)?.value;
  if (!token) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const session = await verifyAccessToken(token).catch(() => null);
  const user = session?.user;
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const allowed = await checkPermission(user, options.module, options.action);
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    return await options.handler(request, { userId: user.id, user });
  } catch (error) {
    console.error("[pawbase] api error", error);
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
