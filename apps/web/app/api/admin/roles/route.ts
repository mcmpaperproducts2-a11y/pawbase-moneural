import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/utils/api-handler";
import { createRole, listRoles } from "@/lib/admin/store";

const roleSchema = z.object({
  name: z.string().regex(/^[a-z_]+$/),
  description: z.string().min(1)
});

export async function GET(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_view",
    handler: async () => NextResponse.json({ data: listRoles() })
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_create",
    handler: async () => {
      const parsed = roleSchema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      const result = createRole(parsed.data);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json(result.role, { status: 201 });
    }
  });
}
