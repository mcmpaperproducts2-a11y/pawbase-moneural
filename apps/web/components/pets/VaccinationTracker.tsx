"use client";

import { AlertCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Vaccination } from "@/lib/owners-pets/store";

function status(expiry?: string) {
  if (!expiry) return { label: "No expiry set", color: "gray" };
  const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (days < 0) return { label: `Expired ${Math.abs(days)}d ago`, color: "red" };
  if (days < 7) return { label: `Expires in ${days}d`, color: "red" };
  if (days < 30) return { label: `Expires in ${days}d`, color: "amber" };
  return { label: `Valid until ${expiry}`, color: "green" };
}

export function VaccinationTracker({ vaccinations }: { vaccinations: Vaccination[] }) {
  return (
    <div className="grid gap-2">
      {vaccinations.map((vaccination) => {
        const state = status(vaccination.expiry_date);
        const Icon = state.color === "green" ? ShieldCheck : state.color === "red" ? AlertCircle : AlertTriangle;
        return (
          <div key={vaccination.id} className={`rounded-lg border p-3 ${state.color === "red" ? "border-red-900 bg-red-950/30" : state.color === "amber" ? "border-[#7a5a24] bg-[#2b2112]" : "border-[#34322f] bg-[#151514]"}`}>
            <div className="flex gap-3">
              <Icon size={18} className={state.color === "red" ? "text-red-400" : state.color === "amber" ? "text-[#f4d59a]" : "text-[#60c94d]"} />
              <div>
                <div className="font-bold text-[#f6f1e8]">{vaccination.vaccine_name}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">Given {vaccination.administered_date} · {state.label}</div>
              </div>
            </div>
          </div>
        );
      })}
      {!vaccinations.length ? <div className="rounded-lg border border-[#34322f] bg-[#151514] p-3 text-sm text-[#b9b0a3]">No vaccinations recorded.</div> : null}
    </div>
  );
}
