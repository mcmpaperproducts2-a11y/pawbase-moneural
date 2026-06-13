import Link from "next/link";
import { PetForm } from "@/components/pets/PetForm";
import { VaccinationTracker } from "@/components/pets/VaccinationTracker";
import { getPet } from "@/lib/owners-pets/store";

export default function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = getPet(params.id);
  if (!pet) return <div>Pet not found</div>;
  return (
    <div className="grid gap-4">
      <section className="overflow-hidden rounded-lg border border-[#34322f] bg-[#201f1d]">
        <div className="grid h-40 place-items-center bg-[#151514] text-5xl">{pet.species === "cat" ? "🐈" : pet.species === "rabbit" ? "🐇" : pet.species === "bird" ? "🐦" : "🐕"}</div>
        <div className="p-4"><div className="text-3xl font-bold text-[#f6f1e8]">{pet.name}</div><div className="mt-1 text-sm font-semibold text-[#b9b0a3]">{pet.breed ?? pet.species} · <Link href={`/owners/${pet.owner_id}`} className="text-[#34c084]">{pet.owner_name}</Link></div><div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div>Weight: {pet.weight_kg ?? "-"} kg</div><div>Gender: {pet.gender ?? "unknown"}</div><div>Neutered: {pet.is_neutered ? "Yes" : "No"}</div><div>Microchip: {pet.microchip_number ?? "-"}</div></div></div>
      </section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3"><h2 className="mb-3 font-bold">Care instructions</h2><div className="text-sm text-[#b9b0a3]">Feeding: {pet.feeding_instructions ?? "No feeding notes"}</div>{pet.special_needs ? <div className="mt-2 rounded-md border border-[#7a5a24] bg-[#2b2112] p-3 text-sm text-[#f4d59a]">{pet.special_needs}</div> : null}<div className="mt-2 text-sm">Temperament: {pet.temperament ?? "Not set"}</div></section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3"><h2 className="mb-3 font-bold">Vaccinations</h2><VaccinationTracker vaccinations={pet.vaccinations} /></section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3"><h2 className="mb-3 font-bold">Vet contacts</h2><div className="grid gap-2">{pet.vets.map((vet) => <div key={vet.id} className={`rounded-md border p-3 ${vet.is_primary ? "border-[#34c084]" : "border-[#4a4842]"} bg-[#151514]`}><div className="font-bold">{vet.vet_name}</div><div className="text-xs text-[#b9b0a3]">{vet.clinic_name} · {vet.phone}</div></div>)}</div></section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3"><h2 className="mb-3 font-bold">Stay history</h2><div className="grid gap-2">{pet.reservations.map((reservation) => <div key={reservation.id} className="rounded-md bg-[#151514] p-3 text-sm">{reservation.check_in_date} to {reservation.check_out_date} · {reservation.status}</div>)}</div></section>
      <PetForm pet={pet} />
    </div>
  );
}
