import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";
import { accessCookieName, legacyAccessCookieName } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions/checker";

const protectedPrefixes = [
  "/dashboard",
  "/reservations",
  "/owners",
  "/pets",
  "/kennel",
  "/checkin",
  "/care",
  "/health",
  "/billing",
  "/staff",
  "/inventory",
  "/reports",
  "/admin"
];

const routeModules: Array<{ prefix: string; module: string; action: "read" | "manage" }> = [
  { prefix: "/admin", module: "admin", action: "manage" },
  { prefix: "/reservations", module: "reservations", action: "read" },
  { prefix: "/owners", module: "owners", action: "read" },
  { prefix: "/pets", module: "pets", action: "read" },
  { prefix: "/kennel", module: "kennel", action: "read" },
  { prefix: "/checkin", module: "checkin", action: "read" },
  { prefix: "/care", module: "care", action: "read" },
  { prefix: "/health", module: "health", action: "read" },
  { prefix: "/billing", module: "billing", action: "read" },
  { prefix: "/staff", module: "staff", action: "read" },
  { prefix: "/inventory", module: "inventory", action: "read" },
  { prefix: "/reports", module: "reports", action: "read" },
  { prefix: "/dashboard", module: "dashboard", action: "read" }
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(accessCookieName)?.value ?? request.cookies.get(legacyAccessCookieName)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const rule = routeModules.find((item) => pathname.startsWith(item.prefix));
  if (rule && !hasPermission(session.user, rule.module, rule.action)) {
    return NextResponse.rewrite(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/reservations/:path*",
    "/owners/:path*",
    "/pets/:path*",
    "/kennel/:path*",
    "/checkin/:path*",
    "/care/:path*",
    "/health/:path*",
    "/billing/:path*",
    "/staff/:path*",
    "/inventory/:path*",
    "/reports/:path*",
    "/admin/:path*"
  ]
};
