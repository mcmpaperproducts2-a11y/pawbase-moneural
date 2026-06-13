"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Owner, Pet } from "@/lib/owners-pets/store";

const species = ["dog", "cat", "rabbit", "bird", "other"] as const;
const temperaments = ["friendly", "calm", "anxious", "energetic", "shy", "aggressive"] as const;

export function PetForm({ pet }: { pet?: Pet | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [draft, setDraft] = useState<Partial<Pet>>({ owner_id: searchParams.get("owner_id") ?? pet?.owner_id, species: pet?.species ?? "dog", ...pet });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/owners?active=all").then((response) => response.json()).then((payload: { data?: Owner[] }) => setOwners(payload.data ?? []));
  }, []);

  function update(key: keyof Pet, value: string | boolean | number) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(pet ? `/api/pets/${pet.id}` : "/api/pets", {
      method: pet ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft)
    });
    if (!response.ok) {
      setError("Unable to save pet.");
      return;
    }
    const payload = await response.json();
    router.push(`/pets/${payload.id ?? payload.data?.id ?? pet?.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <section className="grid gap-3 rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="font-bold text-[#f6f1e8]">Pet profile</h2>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">Owner<select required value={draft.owner_id ?? ""} onChange={(event) => update("owner_id", event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]"><option value="">Select owner</option>{owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.first_name} {owner.last_name}</option>)}</select></label>
        <Input label="Name" value={draft.name} onChange={(value) => update("name", value)} required />
        <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">Species<div className="grid grid-cols-5 gap-2">{species.map((item) => <button type="button" key={item} onClick={() => update("species", item)} className={`h-10 rounded-md border text-xs font-bold capitalize ${draft.species === item ? "border-[#34c084] bg-[#18382d] text-[#9ce4bf]" : "border-[#4a4842] bg-[#151514] text-[#b9b0a3]"}`}>{item}</button>)}</div></label>
        <Input label="Breed" value={draft.breed} onChange={(value) => update("breed", value)} />
        <Input label="Color" value={draft.color} onChange={(value) => update("color", value)} />
        <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">Gender<select value={draft.gender ?? "unknown"} onChange={(event) => update("gender", event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]"><option>unknown</option><option>male</option><option>female</option></select></label>
        <Input label="Date of birth" type="date" value={draft.date_of_birth} onChange={(value) => update("date_of_birth", value)} />
        <Input label="Weight kg" type="number" value={draft.weight_kg ? String(draft.weight_kg) : ""} onChange={(value) => update("weight_kg", Number(value))} />
        <Input label="Microchip number" value={draft.microchip_number} onChange={(value) => update("microchip_number", value)} />
        <label className="flex items-center justify-between rounded-md border border-[#4a4842] bg-[#151514] px-3 py-2 text-sm font-bold text-[#f6f1e8]">Neutered<input type="checkbox" checked={Boolean(draft.is_neutered)} onChange={(event) => update("is_neutered", event.target.checked)} /></label>
      </section>
      <section className="grid gap-3 rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="font-bold text-[#f6f1e8]">Care instructions</h2>
        <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">Temperament<div className="grid grid-cols-3 gap-2">{temperaments.map((item) => <button type="button" key={item} onClick={() => update("temperament", item)} className={`h-10 rounded-md border text-xs font-bold capitalize ${draft.temperament === item ? "border-[#34c084] bg-[#18382d] text-[#9ce4bf]" : "border-[#4a4842] bg-[#151514] text-[#b9b0a3]"}`}>{item}</button>)}</div></label>
        <TextArea label="Feeding instructions" value={draft.feeding_instructions} onChange={(value) => update("feeding_instructions", value)} />
        <TextArea label="Special needs" value={draft.special_needs} onChange={(value) => update("special_needs", value)} />
      </section>
      {error ? <div className="rounded-md bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}
      <button className="h-11 rounded-md bg-[#34c084] font-bold text-white">Save pet</button>
    </form>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: { label: string; value?: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">{label}<input type={type} required={required} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]" /></label>;
}

function TextArea({ label, value, onChange }: { label: string; value?: string; onChange: (value: string) => void }) {
  return <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">{label}<textarea maxLength={500} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-md border border-[#4a4842] bg-[#151514] p-3 text-sm normal-case text-[#f6f1e8]" /></label>;
}
