"use client";

import { useEffect, useState } from "react";
import type { AuditLog } from "@/lib/admin/store";

export function AuditTable() {
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then((response) => response.json())
      .then((payload: { data?: AuditLog[] }) => setRows(payload.data ?? []))
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid gap-2">
      {rows.map((row) => (
        <button key={row.id} type="button" onClick={() => setExpanded(expanded === row.id ? null : row.id)} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-[#f6f1e8]">{row.action} {row.table_name}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{row.user_name} · {new Date(row.created_at).toLocaleString()}</div>
            </div>
            <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{row.record_id}</span>
          </div>
          {expanded === row.id ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <pre className="overflow-auto rounded-md bg-[#151514] p-3 text-xs text-[#f4d59a]">{JSON.stringify(row.old_values ?? {}, null, 2)}</pre>
              <pre className="overflow-auto rounded-md bg-[#151514] p-3 text-xs text-[#9ce4bf]">{JSON.stringify(row.new_values ?? {}, null, 2)}</pre>
            </div>
          ) : null}
        </button>
      ))}
      {!rows.length ? <div className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4 text-sm font-semibold text-[#b9b0a3]">No audit events yet.</div> : null}
    </div>
  );
}
