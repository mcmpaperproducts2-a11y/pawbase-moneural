import Link from "next/link";
import { OwnerForm } from "@/components/pets/OwnerForm";
import { getOwner } from "@/lib/owners-pets/store";

export default function OwnerDetailPage({ params }: { params: { id: string } }) {
  const owner = getOwner(params.id);
  if (!owner) return <div>Owner not found</div>;
  return (
    <div className="grid gap-4">
      <Link href="/owners" className="text-sm font-bold text-[#34c084]">Back to owners</Link>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
        <div className="text-2xl font-bold text-[#f6f1e8]">{owner.first_name} {owner.last_name}</div>
        <div className="mt-1 text-sm font-semibold text-[#b9b0a3]"><a href={`tel:${owner.phone_primary}`}>{owner.phone_primary}</a> · {owner.email ? <a href={`mailto:${owner.email}`}>{owner.email}</a> : "No email"}</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div>Total spent: ₹{owner.financials.total_spent}</div><div>Outstanding: ₹{owner.financials.outstanding}</div></div>
      </section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Pets</h2><Link href={`/pets/new?owner_id=${owner.id}`} className="text-sm font-bold text-[#34c084]">Add pet</Link></div>
        <div className="grid gap-2">{owner.pets.map((pet) => <Link key={pet.id} href={`/pets/${pet.id}`} className="rounded-md bg-[#151514] p-3 font-bold">{pet.name}<div className="text-xs font-semibold text-[#b9b0a3]">{pet.breed ?? pet.species}</div></Link>)}</div>
      </section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="mb-3 font-bold">Stay history</h2>
        <div className="grid gap-2">{owner.reservations.map((reservation) => <div key={reservation.id} className="rounded-md bg-[#151514] p-3 text-sm">{reservation.check_in_date} to {reservation.check_out_date} · {reservation.status} · {reservation.kennel_unit}</div>)}</div>
      </section>
      <OwnerForm owner={owner} />
    </div>
  );
}
