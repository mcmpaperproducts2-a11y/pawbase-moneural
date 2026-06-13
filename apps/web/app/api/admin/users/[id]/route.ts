import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/utils/api-handler";
import { deactivateAdminUser, getAdminUser, updateAdminUser } from "@/lib/admin/store";

const updateUserSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  role_ids: z.array(z.string()).optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, {
    module: "admin",
    action: "can_view",
    handler: async () => {
      const user = getAdminUser(params.id);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(user);
    }
  });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, {
    module: "admin",
    action: "can_edit",
    handler: async (_request, { userId }) => {
      const parsed = updateUserSchema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      const result = updateAdminUser(params.id, parsed.data, userId);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json(result.user);
    }
  });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, {
    module: "admin",
    action: "can_delete",
    handler: async (_request, { userId }) => {
      const result = deactivateAdminUser(params.id, userId);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json(result.user);
    }
  });
}
