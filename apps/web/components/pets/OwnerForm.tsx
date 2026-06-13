"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveLocalOwner } from "@/lib/owners-pets/local";
import type { Owner } from "@/lib/owners-pets/store";

export function OwnerForm({ owner }: { owner?: Owner | null }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Partial<Owner>>(owner ?? {});
  const [error, setError] = useState("");

  function update(key: keyof Owner, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(owner ? `/api/owners/${owner.id}` : "/api/owners", {
      method: owner ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (!response.ok) {
      setError("Unable to save owner.");
      return;
    }
    const payload = await response.json();
    const savedOwner = (payload.data ?? payload) as Owner;
    if (savedOwner?.id) saveLocalOwner(savedOwner);
    router.push(`/owners/${savedOwner.id ?? owner?.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Section title="Personal info">
        <Input label="First name" value={draft.first_name} onChange={(value) => update("first_name", value)} required />
        <Input label="Last name" value={draft.last_name} onChange={(value) => update("last_name", value)} required />
        <Input label="Email" value={draft.email} onChange={(value) => update("email", value)} type="email" />
        <Input label="Primary phone" value={draft.phone_primary} onChange={(value) => update("phone_primary", value)} required />
        <Input label="Secondary phone" value={draft.phone_secondary} onChange={(value) => update("phone_secondary", value)} />
      </Section>
      <Section title="Address">
        <Input label="Address line 1" value={draft.address_line1} onChange={(value) => update("address_line1", value)} />
        <Input label="Address line 2" value={draft.address_line2} onChange={(value) => update("address_line2", value)} />
        <Input label="City" value={draft.city} onChange={(value) => update("city", value)} />
        <Input label="State" value={draft.state} onChange={(value) => update("state", value)} />
        <Input label="Postal code" value={draft.postal_code} onChange={(value) => update("postal_code", value)} />
      </Section>
      <Section title="Emergency contact">
        <Input label="Name" value={draft.emergency_contact_name} onChange={(value) => update("emergency_contact_name", value)} />
        <Input label="Phone" value={draft.emergency_contact_phone} onChange={(value) => update("emergency_contact_phone", value)} />
      </Section>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">Notes<textarea value={draft.notes ?? ""} onChange={(event) => update("notes", event.target.value)} className="min-h-24 rounded-md border border-[#4a4842] bg-[#151514] p-3 text-sm normal-case text-[#f6f1e8]" /></label>
      {error ? <div className="rounded-md bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}
      <button className="h-11 rounded-md bg-[#34c084] font-bold text-white">Save owner</button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="grid gap-3 rounded-lg border border-[#34322f] bg-[#201f1d] p-3"><h2 className="font-bold text-[#f6f1e8]">{title}</h2>{children}</section>;
}

function Input({ label, value, onChange, type = "text", required = false }: { label: string; value?: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">{label}<input type={type} required={required} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]" /></label>;
}
