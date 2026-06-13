"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Download,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import type { ModuleDefinition } from "@/lib/modules/definitions";

type ModuleWorkspaceProps = {
  module: ModuleDefinition;
  mode?: "list" | "new" | "detail" | "calendar";
  detailId?: string;
};

type ModuleRecord = ModuleDefinition["records"][number];
type ModuleTransaction = ModuleDefinition["transactions"][number];
type DraftRecord = {
  title: string;
  subtitle: string;
  status: string;
  amount: string;
  owner: string;
  date: string;
  notes: string;
};

const blankDraft: DraftRecord = {
  title: "",
  subtitle: "",
  status: "active",
  amount: "",
  owner: "",
  date: "",
  notes: ""
};

export function ModuleWorkspace({ module, mode = "list", detailId }: ModuleWorkspaceProps) {
  const [records, setRecords] = useState(module.records);
  const [transactions, setTransactions] = useState(module.transactions);
  const [selectedId, setSelectedId] = useState(detailId ?? module.records[0]?.id);
  const [query, setQuery] = useState("");
  const [detailRecord, setDetailRecord] = useState<ModuleRecord | null>(() =>
    mode === "detail" ? module.records.find((record) => record.id === detailId) ?? module.records[0] ?? null : null
  );
  const [formState, setFormState] = useState<{ mode: "create" | "edit"; record?: ModuleRecord } | null>(
    mode === "new" ? { mode: "create" } : null
  );
  const apiPath = getModuleApiPath(module.id);
  const selected = useMemo(
    () => records.find((record) => record.id === selectedId) ?? records[0],
    [records, selectedId]
  );
  const filteredRecords = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      [record.title, record.subtitle, record.status, record.amount ?? ""].join(" ").toLowerCase().includes(term)
    );
  }, [records, query]);

  useEffect(() => {
    let active = true;
    fetch(apiPath)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { records?: ModuleRecord[]; transactions?: ModuleTransaction[] } | null) => {
        if (!active || !payload) return;
        if (payload.records?.length) {
          setRecords(payload.records);
          setSelectedId((current) => current || payload.records?.[0]?.id || "");
        }
        if (payload.transactions?.length) {
          setTransactions(payload.transactions);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [apiPath]);

  function pushTransaction(label: string) {
    const transaction: ModuleTransaction = {
      id: `${module.id}-tx-${Date.now()}`,
      label,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      by: "Current user"
    };
    setTransactions((current) => [transaction, ...current].slice(0, 8));
  }

  function openDetail(record: ModuleRecord) {
    setSelectedId(record.id);
    setDetailRecord(record);
    pushTransaction(`${record.title} opened`);
  }

  async function saveRecord(draft: DraftRecord) {
    if (formState?.mode === "edit" && formState.record) {
      const updated = {
        ...formState.record,
        title: draft.title,
        subtitle: draft.subtitle,
        status: draft.status,
        amount: draft.amount || undefined
      };
      setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
      setSelectedId(updated.id);
      setDetailRecord(updated);
      pushTransaction(`${module.label} record updated`);
      setFormState(null);
      const payload = await saveToApi(apiPath, "PATCH", updated);
      if (payload?.transactions) setTransactions(payload.transactions);
      return;
    }

    const draftRecord: ModuleRecord = {
      id: `${module.id}-${Date.now()}`,
      title: draft.title || `${module.label} record ${records.length + 1}`,
      subtitle: draft.subtitle || "Created from PawBase",
      status: draft.status || "new",
      amount: draft.amount || undefined
    };
    const payload = await saveToApi(apiPath, "POST", draftRecord);
    const created = payload?.record ?? draftRecord;
    setRecords((current) => [created, ...current]);
    setSelectedId(created.id);
    setDetailRecord(created);
    pushTransaction(`${module.primaryAction} completed`);
    if (payload?.transactions) setTransactions(payload.transactions);
    setFormState(null);
  }

  async function deleteSelected(record: ModuleRecord) {
    const nextRecord = records.find((item) => item.id !== record.id);
    setRecords((current) => current.filter((item) => item.id !== record.id));
    setDetailRecord(null);
    setSelectedId(nextRecord?.id ?? "");
    pushTransaction(`${record.title} deleted`);
    const payload = await saveToApi(apiPath, "DELETE", { id: record.id });
    if (payload?.transactions) setTransactions(payload.transactions);
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-[#34c084]">
              <ArrowLeft size={15} />
              Dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-bold tracking-normal text-[#f6f1e8]">{module.label}</h1>
            <p className="mt-2 text-sm leading-6 text-[#b9b0a3]">{module.summary}</p>
          </div>
          <button
            type="button"
            onClick={() => setFormState({ mode: "create" })}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#34c084] text-white"
            aria-label={`New ${module.label}`}
            title={`New ${module.label}`}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Metric label="Records" value={records.length.toString()} />
          <Metric label="Open" value={records.filter((record) => !["paid", "complete", "resolved"].includes(record.status)).length.toString()} />
          <Metric label="Txns" value={transactions.length.toString()} />
        </div>
      </section>

      {mode === "calendar" ? (
        <FlowBoard module={module} records={records} onOpen={openDetail} />
      ) : null}

      <section className="rounded-lg border border-[#34322f] bg-[#201f1d]">
        <div className="border-b border-[#34322f] p-3">
          <label className="flex h-11 items-center gap-2 rounded-md border border-[#4a4842] bg-[#111110] px-3 text-[#b9b0a3]">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${module.label.toLowerCase()}`}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#f6f1e8] outline-none placeholder:text-[#7d756a]"
            />
          </label>
        </div>
        <div className="grid gap-2 p-3">
          {filteredRecords.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => openDetail(record)}
              className={`grid gap-2 rounded-md border p-3 text-left ${
                selected?.id === record.id ? "border-[#34c084] bg-[#18382d]" : "border-[#4a4842] bg-[#151514]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-bold text-[#f6f1e8]">{record.title}</div>
                  <div className="mt-1 truncate text-sm font-semibold text-[#b9b0a3]">{record.subtitle}</div>
                </div>
                <span className="shrink-0 rounded-md bg-[#2c2b29] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{record.status}</span>
              </div>
              {record.amount ? <div className="text-sm font-bold text-[#60c94d]">{record.amount}</div> : null}
            </button>
          ))}
          {!filteredRecords.length ? <div className="rounded-md border border-[#4a4842] p-4 text-sm font-semibold text-[#b9b0a3]">No records found.</div> : null}
        </div>
      </section>

      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="mb-3 font-bold text-[#f6f1e8]">Quick actions</h2>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton icon={<CheckCircle2 size={17} />} label={module.primaryAction} onClick={() => setFormState({ mode: "create" })} />
          <ActionButton icon={<Bell size={17} />} label="Notify" onClick={() => pushTransaction(`${module.label} notification sent`)} />
          <ActionButton icon={<Download size={17} />} label="Export" onClick={() => pushTransaction(`${module.label} exported`)} />
          <ActionButton icon={<RefreshCw size={17} />} label="Refresh" onClick={() => pushTransaction(`${module.label} refreshed`)} />
        </div>
      </section>

      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <h2 className="mb-3 font-bold text-[#f6f1e8]">Transactions</h2>
        <div className="grid gap-2">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="rounded-md border border-[#4a4842] bg-[#151514] p-3 text-sm">
              <div className="font-bold text-[#f6f1e8]">{transaction.label}</div>
              <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{transaction.at} by {transaction.by}</div>
            </div>
          ))}
        </div>
      </section>

      {detailRecord ? (
        <DetailSheet
          record={detailRecord}
          module={module}
          onClose={() => setDetailRecord(null)}
          onEdit={() => setFormState({ mode: "edit", record: detailRecord })}
          onDelete={() => deleteSelected(detailRecord)}
          onStatus={(status) => {
            const updated = { ...detailRecord, status };
            setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
            setDetailRecord(updated);
            pushTransaction(`${detailRecord.title} marked ${status}`);
            saveToApi(apiPath, "PATCH", updated).then((payload) => {
              if (payload?.transactions) setTransactions(payload.transactions);
            });
          }}
        />
      ) : null}

      {formState ? (
        <RecordFormSheet
          module={module}
          state={formState}
          onClose={() => setFormState(null)}
          onSave={saveRecord}
        />
      ) : null}
    </div>
  );
}

function getModuleApiPath(moduleId: string) {
  if (moduleId === "billing") return "/api/billing/invoices";
  if (moduleId === "admin") return "/api/admin/users";
  return `/api/${moduleId}`;
}

async function saveToApi(apiPath: string, method: "POST" | "PATCH" | "DELETE", body: Partial<ModuleRecord>) {
  const response = await fetch(apiPath, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch(() => null);
  if (!response?.ok) return null;
  return (await response.json().catch(() => null)) as { record?: ModuleRecord; records?: ModuleRecord[]; transactions?: ModuleTransaction[] } | null;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#151514] p-3">
      <div className="text-xs font-bold uppercase text-[#b9b0a3]">{label}</div>
      <div className="mt-1 text-xl font-bold text-[#f6f1e8]">{value}</div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#4a4842] bg-[#151514] text-sm font-bold text-[#f6f1e8]">
      {icon}
      {label}
    </button>
  );
}

function FlowBoard({ module, records, onOpen }: { module: ModuleDefinition; records: ModuleRecord[]; onOpen: (record: ModuleRecord) => void }) {
  const lanes = ["New", "Active", "Done"];
  return (
    <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
      <h2 className="mb-3 font-bold text-[#f6f1e8]">{module.label} flow</h2>
      <div className="grid grid-cols-3 gap-2">
        {lanes.map((lane, index) => (
          <div key={lane} className="rounded-md border border-[#4a4842] bg-[#151514] p-2">
            <div className="mb-2 text-xs font-bold uppercase text-[#b9b0a3]">{lane}</div>
            {(records[index] ? [records[index]] : []).map((record) => (
              <button key={record.id} type="button" onClick={() => onOpen(record)} className="w-full rounded-md bg-[#2c2b29] p-2 text-left text-xs font-bold text-[#f6f1e8]">
                {record.title}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function DetailSheet({
  module,
  record,
  onClose,
  onEdit,
  onDelete,
  onStatus
}: {
  module: ModuleDefinition;
  record: ModuleRecord;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-30 grid place-items-end bg-black/55" onClick={onClose}>
      <section className="w-full max-w-[460px] rounded-t-2xl border border-[#34322f] bg-[#201f1d] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#4a4842]" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase text-[#34c084]">{module.label} detail</div>
            <h2 className="mt-1 text-xl font-bold text-[#f6f1e8]">{record.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#b9b0a3]">{record.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#151514] text-[#b9b0a3]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 rounded-md border border-[#4a4842] bg-[#151514] p-3">
          <div className="text-xs font-bold uppercase text-[#b9b0a3]">Status</div>
          <div className="mt-1 font-bold text-[#f6f1e8]">{record.status}</div>
          {record.amount ? <div className="mt-2 text-sm font-bold text-[#60c94d]">{record.amount}</div> : null}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["active", "complete", "cancelled"].map((status) => (
            <button key={status} type="button" onClick={() => onStatus(status)} className="h-10 rounded-md border border-[#4a4842] bg-[#151514] text-xs font-bold capitalize text-[#f6f1e8]">
              {status}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={onEdit} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#34c084] font-bold text-white">
            <Edit3 size={17} />
            Edit
          </button>
          <button type="button" onClick={onDelete} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#774747] bg-[#392727] font-bold text-[#f3b5a9]">
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

function RecordFormSheet({
  module,
  state,
  onClose,
  onSave
}: {
  module: ModuleDefinition;
  state: { mode: "create" | "edit"; record?: ModuleRecord };
  onClose: () => void;
  onSave: (draft: DraftRecord) => void;
}) {
  const [draft, setDraft] = useState<DraftRecord>({
    ...blankDraft,
    title: state.record?.title ?? "",
    subtitle: state.record?.subtitle ?? "",
    status: state.record?.status ?? "active",
    amount: state.record?.amount ?? "",
    owner: sampleOwner(module.id),
    date: new Date().toISOString().slice(0, 10),
    notes: ""
  });

  function update(field: keyof DraftRecord, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/55" onClick={onClose}>
      <form
        className="w-full max-w-[460px] rounded-t-2xl border border-[#34322f] bg-[#201f1d] p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
      >
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#4a4842]" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase text-[#34c084]">{state.mode === "create" ? "New entry" : "Edit entry"}</div>
            <h2 className="mt-1 text-xl font-bold text-[#f6f1e8]">{module.label}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md bg-[#151514] text-[#b9b0a3]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-3">
          <Field label="Title" value={draft.title} onChange={(value) => update("title", value)} required />
          <Field label="Details" value={draft.subtitle} onChange={(value) => update("subtitle", value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status" value={draft.status} onChange={(value) => update("status", value)} />
            <Field label="Amount" value={draft.amount} onChange={(value) => update("amount", value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner / staff" value={draft.owner} onChange={(value) => update("owner", value)} />
            <Field label="Date" value={draft.date} onChange={(value) => update("date", value)} type="date" />
          </div>
          <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
            Notes
            <textarea
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="min-h-20 rounded-md border border-[#4a4842] bg-[#151514] px-3 py-2 text-sm normal-case text-[#f6f1e8] outline-none"
            />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] font-bold text-[#f6f1e8]">
            Cancel
          </button>
          <button type="submit" className="h-11 rounded-md bg-[#34c084] font-bold text-white">
            {state.mode === "create" ? "Save entry" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8] outline-none"
      />
    </label>
  );
}

function sampleOwner(moduleId: string) {
  if (moduleId === "admin") return "PawBase Super Admin";
  if (moduleId === "staff") return "Priya Nair";
  if (moduleId === "inventory") return "Pet Supply Co";
  return "Asha Rao";
}
