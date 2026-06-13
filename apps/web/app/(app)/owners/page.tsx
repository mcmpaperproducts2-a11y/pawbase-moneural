import Link from "next/link";
import { listOwners } from "@/lib/owners-pets/store";

export default function OwnersPage() {
  const owners = listOwners("", "true");
  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Owners</h1>
          <p className="mt-1 text-sm text-[#b9b0a3]">Client records, pet counts, contacts, and stay history.</p>
        </div>
        <Link href="/owners/new" className="rounded-md bg-[#34c084] px-3 py-2 text-sm font-bold text-white">New owner</Link>
      </div>
      <div className="grid gap-2">
        {owners.map((owner) => (
          <Link key={owner.id} href={`/owners/${owner.id}`} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-[#f6f1e8]">{owner.first_name} {owner.last_name}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{owner.phone_primary} · {owner.email ?? "No email"}</div>
              </div>
              <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{owner.pet_count} pets</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
