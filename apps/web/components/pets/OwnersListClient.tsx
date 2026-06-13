"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadLocalOwners, mergeOwners } from "@/lib/owners-pets/local";
import type { Owner } from "@/lib/owners-pets/store";

type OwnerWithCount = Owner & { pet_count?: number };

export function OwnersListClient({ initialOwners }: { initialOwners: OwnerWithCount[] }) {
  const [owners, setOwners] = useState<OwnerWithCount[]>(initialOwners);

  useEffect(() => {
    setOwners((current) => mergeOwners(loadLocalOwners(), current));
  }, []);

  return (
    <div className="grid gap-2">
      {owners.map((owner) => (
        <Link key={owner.id} href={`/owners/${owner.id}`} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-[#f6f1e8]">{owner.first_name} {owner.last_name}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{owner.phone_primary} · {owner.email ?? "No email"}</div>
            </div>
            <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{owner.pet_count ?? 0} pets</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
