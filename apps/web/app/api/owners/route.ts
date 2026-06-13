import { NextResponse } from "next/server";
import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type OwnerPayload = {
  id?: string;
  data?: Record<string, string>;
};

const tenantIds: Record<string, string> = {
  "PawBase Bengaluru": "20000000-0000-0000-0000-000000000001",
  "PawBase Mumbai": "20000000-0000-0000-0000-000000000002",
  "PawBase Delhi": "20000000-0000-0000-0000-000000000003"
};

function ownerRecord(row: Record<string, any>) {
  const firstName = String(row.first_name ?? "");
  const lastName = String(row.last_name ?? "");
  const title = `${firstName} ${lastName}`.trim() || "Owner";
  const subtitle = [row.email, row.phone_primary].filter(Boolean).join(" · ");

  return {
    id: String(row.id),
    title,
    subtitle,
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

function tenantLabel(id: unknown) {
  return Object.entries(tenantIds).find(([, value]) => value === id)?.[0] ?? "PawBase Bengaluru";
}

function ownerMutation(data: Record<string, string> = {}) {
  return {
    tenant_id: tenantIds[data.tenant_id] ?? data.tenant_id ?? tenantIds["PawBase Bengaluru"],
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email || null,
    phone_primary: data.phone_primary,
    phone_secondary: data.phone_secondary || null,
    address_line1: data.address_line1 || null,
    address_line2: data.address_line2 || null,
    city: data.city || null,
    state: data.state || null,
    postal_code: data.postal_code || null,
    emergency_contact_name: data.emergency_contact_name || null,
    emergency_contact_phone: data.emergency_contact_phone || null,
    notes: data.notes || null,
    updated_at: new Date().toISOString()
  };
}

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return listModuleRecords("owners");

  const { data, error } = await supabase
    .from("owners")
    .select("id, tenant_id, first_name, last_name, email, phone_primary, phone_secondary, address_line1, address_line2, city, state, postal_code, emergency_contact_name, emergency_contact_phone, notes, deleted_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ records: (data ?? []).map(ownerRecord), transactions: [] });
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return createModuleRecord("owners", request);

  const payload = (await request.json().catch(() => ({}))) as OwnerPayload;
  const mutation = ownerMutation(payload.data);
  if (!mutation.first_name || !mutation.last_name || !mutation.phone_primary) {
    return NextResponse.json({ error: "first_name, last_name, and phone_primary are required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("owners").insert(mutation).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ record: ownerRecord(data), transactions: [] }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return updateModuleRecord("owners", request);

  const payload = (await request.json().catch(() => ({}))) as OwnerPayload;
  if (!payload.id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const { data, error } = await supabase
    .from("owners")
    .update(ownerMutation(payload.data))
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ record: ownerRecord(data), transactions: [] });
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return deleteModuleRecord("owners", request);

  const payload = (await request.json().catch(() => ({}))) as OwnerPayload;
  if (!payload.id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const { error } = await supabase
    .from("owners")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", payload.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: payload.id, transactions: [] });
}
