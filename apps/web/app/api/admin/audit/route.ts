import { NextRequest, NextResponse } from "next/server";
import { listAuditLogs } from "@/lib/admin/store";
import { withAuth } from "@/lib/utils/api-handler";

export async function GET(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_view",
    handler: async () => NextResponse.json({ data: listAuditLogs() })
  });
}
