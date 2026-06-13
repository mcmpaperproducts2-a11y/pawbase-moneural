"use client";

import type { Owner, Pet } from "@/lib/owners-pets/store";

const ownerKey = "pawbase:owners:local";
const legacyOwnerRecordKey = "pawbase:owners:records";
const petKey = "pawbase:pets:local";
const legacyPetRecordKey = "pawbase:pets:records";

type LegacyOwnerRecord = {
  id: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, string>;
};

type LegacyPetRecord = {
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

export function loadLocalPets() {
  if (typeof window === "undefined") return [];
  const localPets = readPets(petKey);
  const legacyPets = readLegacyPets();
  return mergePets(localPets, legacyPets);
}

export function saveLocalPet(pet: Pet) {
  if (typeof window === "undefined") return;
  const pets = loadLocalPets();
  const next = [pet, ...pets.filter((item) => item.id !== pet.id)];
  window.localStorage.setItem(petKey, JSON.stringify(next));
}

function readPets(key: string) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as Pet[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readLegacyPets() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(legacyPetRecordKey) ?? "[]") as LegacyPetRecord[];
    if (!Array.isArray(parsed)) return [];
    const pets: Pet[] = [];
    for (const record of parsed) {
      const pet = legacyRecordToPet(record);
      if (pet) pets.push(pet);
    }
    return pets;
  } catch {
    return [];
  }
}

function legacyRecordToPet(record: LegacyPetRecord): Pet | null {
  const data = record.data ?? {};
  const name = data.name || record.title;
  if (!record.id || !name) return null;
  const subtitleParts = (record.subtitle ?? "").split(/[Â·Ã‚]/).map((part) => part.trim()).filter(Boolean);
  return {
    id: record.id,
    owner_id: data.owner_id || "unknown-owner",
    name,
    species: normalizeSpecies(data.species || subtitleParts[0]),
    breed: data.breed || subtitleParts[1],
    color: data.color,
    gender: normalizeGender(data.gender),
    date_of_birth: data.date_of_birth,
    weight_kg: data.weight_kg ? Number(data.weight_kg) : undefined,
    microchip_number: data.microchip_number,
    is_neutered: data.is_neutered === "true",
    temperament: normalizeTemperament(data.temperament),
    feeding_instructions: data.feeding_instructions || data.feeding_notes,
    special_needs: data.special_needs,
    photo_url: data.photo_url,
    is_active: true,
    created_at: new Date().toISOString()
  };
}

function normalizeSpecies(value?: string): Pet["species"] {
  if (value === "cat" || value === "rabbit" || value === "bird" || value === "other") return value;
  return "dog";
}

function normalizeGender(value?: string): Pet["gender"] {
  if (value === "male" || value === "female") return value;
  return "unknown";
}

function normalizeTemperament(value?: string): Pet["temperament"] | undefined {
  if (value === "friendly" || value === "anxious" || value === "aggressive" || value === "calm" || value === "energetic" || value === "shy") return value;
  return undefined;
}

export function mergeOwners(primary: Owner[], secondary: Owner[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((owner) => {
    if (seen.has(owner.id)) return false;
    seen.add(owner.id);
    return true;
  });
}

export function mergePets(primary: Pet[], secondary: Pet[]) {
  const seen = new Set<string>();
  return [...primary, ...secondary].filter((pet) => {
    if (seen.has(pet.id)) return false;
    seen.add(pet.id);
    return true;
  });
}
