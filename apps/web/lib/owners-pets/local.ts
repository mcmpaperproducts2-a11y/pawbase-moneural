"use client";

import type { Owner } from "@/lib/owners-pets/store";

const ownerKey = "pawbase:owners:local";

export function loadLocalOwners() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ownerKey) ?? "[]") as Owner[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
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
