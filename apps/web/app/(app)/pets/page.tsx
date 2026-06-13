import Link from "next/link";
import { listPets } from "@/lib/owners-pets/store";

export default function PetsPage() {
  const pets = listPets();
  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Pets</h1><p className="mt-1 text-sm text-[#b9b0a3]">Animal profiles, owners, care notes, vaccinations, and vets.</p></div>
        <Link href="/pets/new" className="rounded-md bg-[#34c084] px-3 py-2 text-sm font-bold text-white">New pet</Link>
      </div>
      <div className="grid grid-cols-5 gap-2 text-xs font-bold text-[#b9b0a3]"><span>All</span><span>Dogs</span><span>Cats</span><span>Rabbits</span><span>Birds</span></div>
      <div className="grid gap-2">
        {pets.map((pet) => (
          <Link key={pet.id} href={`/pets/${pet.id}`} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
            <div className="flex items-start justify-between gap-3"><div><div className="font-bold text-[#f6f1e8]">{pet.name}</div><div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{pet.breed ?? pet.species} · {pet.owner_name}</div></div><span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{pet.species}</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
