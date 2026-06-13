"use client";

import Link from "next/link";
import { useState } from "react";

type Checkin = { id: string; pet: string; breed?: string; owner: string; unit?: string; time: string };

export function TodayCheckins({ checkins, checkouts }: { checkins: Checkin[]; checkouts: Checkin[] }) {
  const [tab, setTab] = useState<"in" | "out">("in");
  const rows = tab === "in" ? checkins : checkouts;
  return (
    <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
      <div className="mb-3 grid grid-cols-2 rounded-md bg-[#151514] p-1">
        <button onClick={() => setTab("in")} className={`h-9 rounded-md text-sm font-bold ${tab === "in" ? "bg-[#34c084] text-white" : "text-[#b9b0a3]"}`}>Checking in ({checkins.length})</button>
        <button onClick={() => setTab("out")} className={`h-9 rounded-md text-sm font-bold ${tab === "out" ? "bg-[#34c084] text-white" : "text-[#b9b0a3]"}`}>Checking out ({checkouts.length})</button>
      </div>
      <div className="grid gap-2">
        {rows.map((row) => (
          <Link key={row.id} href={`/checkin/${row.id}`} className="rounded-md border border-[#4a4842] bg-[#151514] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-[#f6f1e8]">{row.pet}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{row.owner} · {row.unit ?? row.breed}</div>
              </div>
              <span className="rounded-md bg-[#dceeff] px-2 py-1 text-xs font-bold text-[#07559b]">{row.time}</span>
            </div>
          </Link>
        ))}
        {!rows.length ? <div className="rounded-md bg-[#151514] p-3 text-sm text-[#b9b0a3]">No activity in this tab.</div> : null}
      </div>
    </section>
  );
}
