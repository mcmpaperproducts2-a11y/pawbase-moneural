import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { invalidatePattern } from "@/lib/cache";
import { getPermissionMatrix, upsertPermission } from "@/lib/admin/store";
import { withAuth } from "@/lib/utils/api-handler";

const saveSchema = z.object({
  role_id: z.string(),
  module_id: z.string(),
  can_create: z.boolean(),
  can_view: z.boolean(),
  can_edit: z.boolean(),
  can_delete: z.boolean()
});

export async function GET(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_view",
    handler: async () => NextResponse.json(getPermissionMatrix())
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_edit",
    handler: async () => {
      const parsed = saveSchema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      upsertPermission(parsed.data);
      await invalidatePattern(`pb:perm:${parsed.data.role_id}:*`);
      return NextResponse.json({ ok: true });
    }
  });
}
