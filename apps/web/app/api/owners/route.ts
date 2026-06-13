import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOwner, listOwners } from "@/lib/owners-pets/store";

const ownerSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.string().email().optional().or(z.literal("")),
  phone_primary: z.string().min(10),
  phone_secondary: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const active = request.nextUrl.searchParams.get("active") ?? "true";
  return NextResponse.json({ data: listOwners(q, active), records: listOwners(q, active).map((owner) => ({ id: owner.id, title: `${owner.first_name} ${owner.last_name}`, subtitle: `${owner.email ?? ""} · ${owner.phone_primary}`, status: owner.is_active ? "active" : "inactive", data: owner as any })) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const data = body?.data ?? body;
  const parsed = ownerSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const result = createOwner(parsed.data);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ data: result.owner, record: { id: result.owner.id, title: `${result.owner.first_name} ${result.owner.last_name}`, subtitle: `${result.owner.email ?? ""} · ${result.owner.phone_primary}`, status: "active", data: result.owner as any } }, { status: 201 });
}
