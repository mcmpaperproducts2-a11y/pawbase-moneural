import { NextResponse } from "next/server";
import { getModuleRecord } from "@/lib/api/module-response";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const tenantIds: Record<string, string> = {
  "PawBase Bengaluru": "20000000-0000-0000-0000-000000000001",
  "PawBase Mumbai": "20000000-0000-0000-0000-000000000002",
  "PawBase Delhi": "20000000-0000-0000-0000-000000000003"
};

function tenantLabel(id: unknown) {
  return Object.entries(tenantIds).find(([, value]) => value === id)?.[0] ?? "PawBase Bengaluru";
}

function ownerRecord(row: Record<string, any>) {
  const firstName = String(row.first_name ?? "");
  const lastName = String(row.last_name ?? "");
  return {
    id: String(row.id),
    title: `${firstName} ${lastName}`.trim() || "Owner",
    subtitle: [row.email, row.phone_primary].filter(Boolean).join(" · "),
    status: row.deleted_at ? "deleted" : "active",
    data: {
      tenant_id: tenantLabel(row.tenant_id),
      first_name: firstName,
      last_name: lastName,
      email: String(row.email ?? ""),
      phone_primary: String(row.phone_primary ?? ""),
      phone_secondary: String(row.phone_secondary ?? ""),
      address_line1: String(row.address_line1 ?? ""),
      address_line2: String(row.address_line2 ?? ""),
      city: String(row.city ?? ""),
      state: String(row.state ?? ""),
      postal_code: String(row.postal_code ?? ""),
      emergency_contact_name: String(row.emergency_contact_name ?? ""),
      emergency_contact_phone: String(row.emergency_contact_phone ?? ""),
      notes: String(row.notes ?? "")
    }
  };
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return getModuleRecord("owners", params.id);

  const { data, error } = await supabase
    .from("owners")
    .select("id, tenant_id, first_name, last_name, email, phone_primary, phone_secondary, address_line1, address_line2, city, state, postal_code, emergency_contact_name, emergency_contact_phone, notes, deleted_at")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ record: ownerRecord(data), transactions: [] });
}
