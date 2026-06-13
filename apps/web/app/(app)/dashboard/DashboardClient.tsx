"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { OccupancyCard } from "@/components/dashboard/OccupancyCard";
import { TodayCheckins } from "@/components/dashboard/TodayCheckins";
import type { DashboardData } from "@/lib/dashboard/data";

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      const response = await fetch("/api/reports/dashboard");
      setLoading(false);
      if (response.ok) setData(await response.json());
    };
    const interval = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-[#b9b0a3]">{loading ? "Refreshing..." : "Live kennel command centre"}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <OccupancyCard {...data.occupancy} />
        <MetricCard label="Revenue today" value={`₹${data.revenue_today.toLocaleString("en-IN")}`} />
        <MetricCard label="Check-ins today" value={String(data.checkins_today.length)} />
        <MetricCard label="Check-outs today" value={String(data.checkouts_today.length)} tone="amber" />
        <MetricCard label="Pending invoices" value={`₹${data.pending_invoices.amount.toLocaleString("en-IN")}`} tone="amber" />
      </div>
      {data.pending_invoices.count ? (
        <Link href="/billing" className="rounded-lg border border-[#7a5a24] bg-[#2b2112] p-3 text-sm font-semibold text-[#f4d59a]">
          {data.pending_invoices.count} unpaid invoices · ₹{data.pending_invoices.amount.toLocaleString("en-IN")} outstanding
        </Link>
      ) : null}
      <TodayCheckins checkins={data.checkins_today} checkouts={data.checkouts_today} />
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="mb-3 font-bold text-[#f6f1e8]">Boarding now ({data.current_boarders.length})</h2>
        <div className="grid gap-2">
          {data.current_boarders.map((row) => (
            <Link key={row.id} href={`/reservations/${row.id}`} className="rounded-md border border-[#4a4842] bg-[#151514] p-3">
              <div className="font-bold text-[#f6f1e8]">{row.pet}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{row.owner} · {row.unit} · Out {row.check_out_date}</div>
            </Link>
          ))}
        </div>
      </section>
      <AlertsFeed alerts={data.vaccination_alerts} />
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="mb-3 font-bold text-[#f6f1e8]">Upcoming</h2>
        <div className="grid gap-2">
          {data.upcoming_reservations.map((row) => (
            <Link key={row.id} href={`/reservations/${row.id}`} className="rounded-md border border-[#4a4842] bg-[#151514] p-3">
              <div className="font-bold text-[#f6f1e8]">{row.pet}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{row.owner} · {row.check_in_date} to {row.check_out_date}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone = "green" }: { label: string; value: string; tone?: "green" | "amber" }) {
  return (
    <div className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
      <div className="text-xs font-bold uppercase text-[#b9b0a3]">{label}</div>
      <div className={`mt-2 text-xl font-bold ${tone === "amber" ? "text-[#f4d59a]" : "text-[#60c94d]"}`}>{value}</div>
    </div>
  );
}
