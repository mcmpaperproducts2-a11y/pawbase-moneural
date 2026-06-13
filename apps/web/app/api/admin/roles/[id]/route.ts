import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/utils/api-handler";
import { deleteRole, updateRole } from "@/lib/admin/store";

const roleSchema = z.object({
  name: z.string().regex(/^[a-z_]+$/).optional(),
  description: z.string().min(1).optional()
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, {
    module: "admin",
    action: "can_edit",
    handler: async () => {
      const parsed = roleSchema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      const result = updateRole(params.id, parsed.data);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json(result.role);
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, {
    module: "admin",
    action: "can_delete",
    handler: async () => {
      const result = deleteRole(params.id);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json({ ok: true });
    }
  });
}
