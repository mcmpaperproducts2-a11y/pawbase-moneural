import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard/data";
import { withAuth } from "@/lib/utils/api-handler";

let cache: { expiresAt: number; data: Awaited<ReturnType<typeof getDashboardData>> } | null = null;

export async function GET(request: NextRequest) {
  return withAuth(request, {
    module: "dashboard",
    action: "can_view",
    handler: async () => {
      if (cache && cache.expiresAt > Date.now()) return NextResponse.json(cache.data);
      const data = await getDashboardData();
      cache = { data, expiresAt: Date.now() + 120_000 };
      return NextResponse.json(data);
    }
  });
}
