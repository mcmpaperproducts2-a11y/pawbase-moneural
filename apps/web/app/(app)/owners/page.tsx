import Link from "next/link";
import { OwnersListClient } from "@/components/pets/OwnersListClient";
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
      <OwnersListClient initialOwners={owners} />
    </div>
  );
}
