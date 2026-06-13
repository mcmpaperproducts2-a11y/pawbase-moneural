import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { sendWelcomeEmail } from "@/lib/notifications/email";
import { withAuth } from "@/lib/utils/api-handler";
import { createAdminUser, listAdminUsers } from "@/lib/admin/store";

const createUserSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2).max(100),
  phone: z.string().optional().nullable(),
  role_ids: z.array(z.string()).min(1, "Assign at least one role")
});

export async function GET(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_view",
    handler: async () => {
      const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
      const limit = 20;
      const q = request.nextUrl.searchParams.get("q") ?? "";
      const status = request.nextUrl.searchParams.get("status") ?? "all";
      const rows = listAdminUsers(q, status);
      const start = (page - 1) * limit;
      return NextResponse.json({ data: rows.slice(start, start + limit), count: rows.length, page, limit });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, {
    module: "admin",
    action: "can_create",
    handler: async (_request, { userId }) => {
      const parsed = createUserSchema.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

      const tempPassword = Math.random().toString(36).slice(2, 10) + "A1!";
      await hashPassword(tempPassword);
      const result = createAdminUser(parsed.data, userId);
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

      sendWelcomeEmail({ to: result.user.email, name: result.user.full_name, tempPassword }).catch(console.error);
      return NextResponse.json(result.user, { status: 201 });
    }
  });
}
