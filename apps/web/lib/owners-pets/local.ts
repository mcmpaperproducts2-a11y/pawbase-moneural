"use client";

import type { Owner } from "@/lib/owners-pets/store";

const ownerKey = "pawbase:owners:local";
const legacyOwnerRecordKey = "pawbase:owners:records";

type LegacyOwnerRecord = {
  id: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, string>;
};

export function loadLocalOwners() {
  if (typeof window === "undefined") return [];
  const localOwners = readOwners(ownerKey);
  const legacyOwners = readLegacyOwners();
  return mergeOwners(localOwners, legacyOwners);
}

function readOwners(key: string) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Owner[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLegacyOwners() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(legacyOwnerRecordKey) ?? "[]") as LegacyOwnerRecord[];
    if (!Array.isArray(parsed)) return [];
    const owners: Owner[] = [];
    for (const record of parsed) {
      const owner = legacyRecordToOwner(record);
      if (owner) owners.push(owner);
    }
    return owners;
  } catch {
    return [];
  }
}

function legacyRecordToOwner(record: LegacyOwnerRecord): Owner | null {
  const data = record.data ?? {};
  const [titleFirstName = "", ...titleRest] = (record.title ?? "").split(" ");
  const firstName = data.first_name || titleFirstName;
  const lastName = data.last_name || titleRest.join(" ");
  if (!record.id || !firstName) return null;

  return {
    id: record.id,
    first_name: firstName,
    last_name: lastName,
    email: data.email || parseSubtitle(record.subtitle).email,
    phone_primary: data.phone_primary || parseSubtitle(record.subtitle).phone || "",
    phone_secondary: data.phone_secondary,
    address_line1: data.address_line1,
    address_line2: data.address_line2,
    city: data.city,
    state: data.state,
    postal_code: data.postal_code,
    emergency_contact_name: data.emergency_contact_name,
    emergency_contact_phone: data.emergency_contact_phone,
    notes: data.notes,
    is_active: true,
    created_at: new Date().toISOString()
  };
}

function parseSubtitle(subtitle = "") {
  const parts = subtitle.split(/[·Â]/).map((part) => part.trim()).filter(Boolean);
  return {
    email: parts.find((part) => part.includes("@")),
    phone: parts.find((part) => /\d{6,}/.test(part))
  };
}

export function saveLocalOwner(owner: Owner) {
  if (typeof window === "undefined") return;
  const owners = loadLocalOwners();
  const next = [owner, ...owners.filter((item) => item.id !== owner.id)];
  window.localStorage.setItem(ownerKey, JSON.stringify(next));
}

export function mergeOwners(primary: Owner[], secondary: Owner[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((owner) => {
    if (seen.has(owner.id)) return false;
    seen.add(owner.id);
    return true;
  });
}
