import Link from "next/link";
import { PetsListClient } from "@/components/pets/PetsListClient";
import { listPets } from "@/lib/owners-pets/store";

export default function PetsPage() {
  const pets = listPets();
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pets</h1>
          <p className="mt-1 text-sm text-[#b9b0a3]">Animal profiles, owners, care notes, vaccinations, and vets.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/owners/new" className="rounded-md border border-[#34c084] bg-[#18382d] px-3 py-2 text-center text-sm font-bold text-[#9ce4bf]">
            New owner
          </Link>
          <Link href="/pets/new" className="rounded-md bg-[#34c084] px-3 py-2 text-center text-sm font-bold text-white">
            New pet
          </Link>
        </div>
      </div>
      <PetsListClient initialPets={pets} />
    </div>
  );
}
