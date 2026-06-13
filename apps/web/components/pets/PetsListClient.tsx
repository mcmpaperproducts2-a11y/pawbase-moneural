"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadLocalPets, mergePets } from "@/lib/owners-pets/local";
import type { Pet } from "@/lib/owners-pets/store";

type PetListItem = Pet & { owner_name?: string; vaccination_alert?: unknown };
const filters: Array<{ label: string; value: "all" | Pet["species"] }> = [
  { label: "All", value: "all" },
  { label: "Dogs", value: "dog" },
  { label: "Cats", value: "cat" },
  { label: "Rabbits", value: "rabbit" },
  { label: "Birds", value: "bird" }
];

export function PetsListClient({ initialPets }: { initialPets: PetListItem[] }) {
  const [pets, setPets] = useState<PetListItem[]>(initialPets);
  const [species, setSpecies] = useState<"all" | Pet["species"]>("all");

  useEffect(() => {
    setPets((current) => mergePets(loadLocalPets(), current));
    fetch("/api/pets")
      .then((response) => response.json())
      .then((payload: { data?: PetListItem[] }) => setPets((current) => mergePets(payload.data ?? [], current)))
      .catch(() => undefined);
  }, []);

  const filteredPets = useMemo(
    () => pets.filter((pet) => pet.is_active !== false && (species === "all" || pet.species === species)),
    [pets, species]
  );

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-5 gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSpecies(filter.value)}
            className={`h-9 rounded-md text-xs font-bold ${species === filter.value ? "bg-[#34c084] text-white" : "bg-[#151514] text-[#b9b0a3]"}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {filteredPets.map((pet) => (
          <Link key={pet.id} href={`/pets/${pet.id}`} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-[#f6f1e8]">{pet.name}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{pet.breed ?? pet.species} · {pet.owner_name ?? "Owner not linked"}</div>
              </div>
              <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{pet.species}</span>
            </div>
          </Link>
        ))}
        {!filteredPets.length ? (
          <div className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4 text-sm font-semibold text-[#b9b0a3]">
            No pets found for this filter.
          </div>
        ) : null}
      </div>
    </div>
  );
}
