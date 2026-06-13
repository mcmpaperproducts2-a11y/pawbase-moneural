"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Plus, RefreshCw } from "lucide-react";
import type { ModuleDefinition } from "@/lib/modules/definitions";

type ModuleWorkspaceProps = {
  module: ModuleDefinition;
  mode?: "list" | "new" | "detail" | "calendar";
  detailId?: string;
};

export function ModuleWorkspace({ module, mode = "list", detailId }: ModuleWorkspaceProps) {
  const [records, setRecords] = useState(module.records);
  const [transactions, setTransactions] = useState(module.transactions);
  const [selectedId, setSelectedId] = useState(detailId ?? module.records[0]?.id);
  const selected = useMemo(
    () => records.find((record) => record.id === selectedId) ?? records[0],
    [records, selectedId]
  );

  function completeTransaction(label: string) {
    const id = `${module.id}-${Date.now()}`;
    setTransactions((current) => [{ id, label, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), by: "Current user" }, ...current]);
  }

  function addRecord() {
    const nextNumber = records.length + 1;
    const record = {
      id: `${module.id}-${Date.now()}`,
      title: `${module.label} record ${nextNumber}`,
      subtitle: "Created from module workspace",
      status: "new"
    };
    setRecords((current) => [record, ...current]);
    setSelectedId(record.id);
    completeTransaction(`${module.primaryAction} completed`);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-normal">{module.label}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{module.summary}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`${module.href}/new`} className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-white px-3 font-semibold">
            <Plus size={18} />
            New
          </Link>
          <button onClick={addRecord} type="button" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-3 font-semibold text-primary-foreground">
            <CheckCircle2 size={18} />
            {module.primaryAction}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-md border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-semibold">{mode === "calendar" ? "Calendar flow" : mode === "new" ? "Create transaction" : "Records"}</h2>
            <Link href={module.href} className="text-sm font-semibold text-primary">Module home</Link>
          </div>
          <div className="grid gap-3 p-3">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`${module.href}/${record.id}`}
                onClick={() => setSelectedId(record.id)}
                className="grid gap-2 rounded-md border border-border p-4 hover:border-primary"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{record.title}</div>
                    <div className="text-sm text-muted-foreground">{record.subtitle}</div>
                  </div>
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">{record.status}</span>
                </div>
                {record.amount ? <div className="text-sm font-semibold">{record.amount}</div> : null}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-border bg-white">
          <div className="border-b border-border p-4">
            <h2 className="font-semibold">Detail and actions</h2>
          </div>
          <div className="grid gap-4 p-4">
            {selected ? (
              <div className="rounded-md bg-muted p-4">
                <div className="text-lg font-bold">{selected.title}</div>
                <div className="text-sm text-muted-foreground">{selected.subtitle}</div>
                <div className="mt-3 inline-flex rounded-md bg-white px-2 py-1 text-xs font-semibold">{selected.status}</div>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => completeTransaction(`${module.label} record updated`)} className="h-11 rounded-md border border-border bg-white font-semibold" type="button">Update</button>
              <button onClick={() => completeTransaction(`${module.label} notification sent`)} className="h-11 rounded-md border border-border bg-white font-semibold" type="button">Notify</button>
              <button onClick={() => completeTransaction(`${module.label} exported`)} className="h-11 rounded-md border border-border bg-white font-semibold" type="button">Export</button>
              <button onClick={() => completeTransaction(`${module.label} cache refreshed`)} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-white font-semibold" type="button">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Transactions</h3>
              <div className="grid gap-2">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="font-semibold">{transaction.label}</div>
                    <div className="text-muted-foreground">{transaction.at} by {transaction.by}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
