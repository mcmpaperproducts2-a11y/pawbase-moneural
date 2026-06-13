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
type FieldDefinition = {
  key: string;
  label: string;
  type?: "text" | "date" | "number" | "email" | "tel" | "select" | "textarea";
  required?: boolean;
  options?: string[];
};
type DraftRecord = Record<string, string>;

const moduleFieldDefinitions: Record<string, FieldDefinition[]> = {
  reservations: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "owner_id", label: "Owner", required: true, options: ["Asha Rao", "Kabir Menon", "Neha Shah"], type: "select" },
    { key: "pet_id", label: "Pet", required: true, options: ["Bruno", "Rio", "Mochi"], type: "select" },
    { key: "kennel_unit_id", label: "Kennel unit", options: ["Garden Suite 04", "Cat Condo 02", "Deluxe 11"], type: "select" },
    { key: "status", label: "Status", required: true, options: ["inquiry", "confirmed", "checked_in", "completed", "cancelled", "no_show"], type: "select" },
    { key: "check_in_date", label: "Check-in date", required: true, type: "date" },
    { key: "check_out_date", label: "Check-out date", required: true, type: "date" },
    { key: "total_amount", label: "Total amount", type: "number" },
    { key: "notes", label: "Reservation notes", type: "textarea" }
  ],
  owners: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "first_name", label: "First name", required: true },
    { key: "last_name", label: "Last name", required: true },
    { key: "email", label: "Email", type: "email" },
    { key: "phone_primary", label: "Primary phone", required: true, type: "tel" },
    { key: "phone_secondary", label: "Secondary phone", type: "tel" },
    { key: "address_line1", label: "Address line 1" },
    { key: "address_line2", label: "Address line 2" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "postal_code", label: "Postal code" },
    { key: "emergency_contact_name", label: "Emergency contact name" },
    { key: "emergency_contact_phone", label: "Emergency contact phone", type: "tel" },
    { key: "notes", label: "Owner notes", type: "textarea" }
  ],
  pets: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "owner_id", label: "Owner", required: true, options: ["Asha Rao", "Kabir Menon", "Neha Shah"], type: "select" },
    { key: "name", label: "Pet name", required: true },
    { key: "species", label: "Species", required: true, options: ["dog", "cat", "other"], type: "select" },
    { key: "breed", label: "Breed" },
    { key: "temperament", label: "Temperament", options: ["social", "playful", "quiet", "anxious", "special handling"], type: "select" },
    { key: "feeding_notes", label: "Feeding notes", type: "textarea" }
  ],
  kennel: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "unit_number", label: "Unit number", required: true },
    { key: "kennel_type_id", label: "Kennel type", required: true, options: ["Garden Suite", "Cat Condo", "Mumbai Deluxe"], type: "select" },
    { key: "status", label: "Unit status", required: true, options: ["available", "occupied", "reserved", "cleaning", "maintenance"], type: "select" },
    { key: "base_rate", label: "Base rate", type: "number" },
    { key: "capacity", label: "Capacity", type: "number" },
    { key: "maintenance_notes", label: "Maintenance notes", type: "textarea" }
  ],
  checkin: [
    { key: "reservation_id", label: "Reservation", required: true, options: ["Bailey boarding stay", "Milo weekend care", "Rio arrival"], type: "select" },
    { key: "workflow_type", label: "Workflow", required: true, options: ["check_in", "check_out"], type: "select" },
    { key: "status", label: "Status", required: true, options: ["ready", "in_progress", "completed", "payment_due", "attention"], type: "select" },
    { key: "condition_notes", label: "Condition notes", type: "textarea" },
    { key: "vaccination_verified", label: "Vaccination verified", options: ["yes", "no"], type: "select" },
    { key: "medication_handover", label: "Medication handover" },
    { key: "staff_signature", label: "Staff signature", required: true }
  ],
  care: [
    { key: "reservation_id", label: "Reservation", required: true, options: ["Bailey boarding stay", "Milo weekend care", "Rio arrival"], type: "select" },
    { key: "pet_id", label: "Pet", required: true, options: ["Bruno", "Rio", "Mochi"], type: "select" },
    { key: "care_date", label: "Care date", required: true, type: "date" },
    { key: "feeding", label: "Feeding", options: ["not_started", "completed", "skipped", "exception"], type: "select" },
    { key: "medication", label: "Medication", options: ["none", "due", "administered", "missed"], type: "select" },
    { key: "exercise", label: "Exercise", options: ["not_started", "yard", "walk", "play_group", "complete"], type: "select" },
    { key: "mood", label: "Mood", options: ["happy", "calm", "anxious", "tired", "watch"], type: "select" },
    { key: "notes", label: "Care notes", type: "textarea" }
  ],
  billing: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "reservation_id", label: "Reservation", options: ["Bailey boarding stay", "Milo weekend care", "Rio arrival"], type: "select" },
    { key: "owner_id", label: "Owner", required: true, options: ["Asha Rao", "Kabir Menon", "Neha Shah"], type: "select" },
    { key: "invoice_number", label: "Invoice number", required: true },
    { key: "status", label: "Invoice status", required: true, options: ["draft", "issued", "paid", "overdue", "void"], type: "select" },
    { key: "subtotal", label: "Subtotal", type: "number" },
    { key: "tax_amount", label: "Tax amount", type: "number" },
    { key: "total_amount", label: "Total amount", type: "number" },
    { key: "payment_method", label: "Payment method", options: ["cash", "upi", "card", "razorpay", "bank_transfer"], type: "select" }
  ],
  inventory: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "name", label: "Item name", required: true },
    { key: "category", label: "Category", options: ["food", "medicine", "cleaning", "retail", "other"], type: "select" },
    { key: "quantity_on_hand", label: "Quantity on hand", required: true, type: "number" },
    { key: "reorder_level", label: "Reorder level", type: "number" },
    { key: "unit_cost", label: "Unit cost", type: "number" },
    { key: "supplier", label: "Supplier" }
  ],
  reports: [
    { key: "report_type", label: "Report type", required: true, options: ["occupancy", "revenue", "customers", "staff_efficiency", "inventory"], type: "select" },
    { key: "date_from", label: "Date from", required: true, type: "date" },
    { key: "date_to", label: "Date to", required: true, type: "date" },
    { key: "tenant_id", label: "Tenant", options: ["All tenants", "PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "group_by", label: "Group by", options: ["day", "week", "month", "service", "tenant"], type: "select" },
    { key: "export_format", label: "Export format", options: ["csv", "xlsx", "pdf"], type: "select" }
  ],
  staff: [
    { key: "tenant_id", label: "Tenant", required: true, options: ["PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "staff_name", label: "Staff member", required: true },
    { key: "role", label: "Role", required: true, options: ["manager", "receptionist", "vet_staff", "groomer"], type: "select" },
    { key: "shift_date", label: "Shift date", type: "date" },
    { key: "start_time", label: "Start time" },
    { key: "end_time", label: "End time" },
    { key: "assigned_tasks", label: "Assigned tasks", type: "textarea" }
  ],
  admin: [
    { key: "tenant_id", label: "Tenant", options: ["Global", "PawBase Bengaluru", "PawBase Mumbai", "PawBase Delhi"], type: "select" },
    { key: "email", label: "Email", required: true, type: "email" },
    { key: "full_name", label: "Full name", required: true },
    { key: "role", label: "Role", required: true, options: ["super_admin", "manager", "receptionist", "vet_staff", "groomer"], type: "select" },
    { key: "is_active", label: "Active", options: ["true", "false"], type: "select" },
    { key: "module_permissions", label: "Module permissions", type: "textarea" }
  ],
  dashboard: [
    { key: "metric_name", label: "Metric name", required: true },
    { key: "metric_value", label: "Metric value", required: true },
    { key: "status", label: "Status", options: ["normal", "attention", "critical"], type: "select" }
  ]
};

function getModuleFields(moduleId: string) {
  return moduleFieldDefinitions[moduleId] ?? moduleFieldDefinitions.dashboard;
}

function getDefaultValue(field: FieldDefinition) {
  if (field.options?.length) return field.options[0];
  if (field.type === "date") return new Date().toISOString().slice(0, 10);
  if (field.type === "number") return "0";
  return "";
}

function recordToDraft(record: ModuleRecord | undefined, fields: FieldDefinition[]) {
  const draft: DraftRecord = {};
  for (const field of fields) {
    draft[field.key] = record?.data?.[field.key] ?? inferRecordValue(record, field.key) ?? getDefaultValue(field);
  }
  return draft;
}

function inferRecordValue(record: ModuleRecord | undefined, key: string) {
  if (!record) return "";
  if (key === "status") return record.status;
  if (key === "total_amount" || key === "amount" || key === "subtotal") return record.amount?.replace(/[^\d.]/g, "") ?? "";
  if (key === "notes") return record.subtitle;
  return "";
}

function buildRecordFromDraft(module: ModuleDefinition, draft: DraftRecord, existing?: ModuleRecord): ModuleRecord {
  const title = getRecordTitle(module.id, draft, existing);
  const subtitle = getRecordSubtitle(module.id, draft, existing);
  const status = draft.status || draft.is_active || existing?.status || "active";
  const amount = getRecordAmount(module.id, draft, existing);

  return {
    id: existing?.id ?? `${module.id}-${Date.now()}`,
    title,
    subtitle,
    status,
    amount,
    data: draft
  };
}

function getRecordTitle(moduleId: string, draft: DraftRecord, existing?: ModuleRecord) {
  if (moduleId === "owners") return `${draft.first_name ?? ""} ${draft.last_name ?? ""}`.trim() || existing?.title || "Owner";
  if (moduleId === "pets") return draft.name || existing?.title || "Pet";
  if (moduleId === "kennel") return draft.unit_number || draft.kennel_type_id || existing?.title || "Kennel unit";
  if (moduleId === "reservations") return `${draft.pet_id || "Pet"} reservation`;
  if (moduleId === "billing") return draft.invoice_number || existing?.title || "Invoice";
  if (moduleId === "inventory") return draft.name || existing?.title || "Inventory item";
  if (moduleId === "admin") return draft.full_name || draft.email || existing?.title || "User";
  return existing?.title || draft.title || `${moduleId} record`;
}

function getRecordSubtitle(moduleId: string, draft: DraftRecord, existing?: ModuleRecord) {
  if (moduleId === "owners") return [draft.email, draft.phone_primary].filter(Boolean).join(" · ") || existing?.subtitle || "";
  if (moduleId === "pets") return [draft.species, draft.breed, draft.owner_id].filter(Boolean).join(" · ") || existing?.subtitle || "";
  if (moduleId === "reservations") return [draft.owner_id, draft.check_in_date, draft.check_out_date].filter(Boolean).join(" · ") || existing?.subtitle || "";
  if (moduleId === "kennel") return [draft.kennel_type_id, draft.status].filter(Boolean).join(" · ") || existing?.subtitle || "";
  if (moduleId === "billing") return [draft.owner_id, draft.status].filter(Boolean).join(" · ") || existing?.subtitle || "";
  if (moduleId === "admin") return [draft.email, draft.role].filter(Boolean).join(" · ") || existing?.subtitle || "";
  return draft.notes || existing?.subtitle || "Created from PawBase";
}

function getRecordAmount(moduleId: string, draft: DraftRecord, existing?: ModuleRecord) {
  const value = draft.total_amount || draft.amount || draft.subtotal;
  if (!value) return existing?.amount;
  return moduleId === "billing" || moduleId === "reservations" ? `₹${value}` : value;
}

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
  const fields = getModuleFields(module.id);
  const selected = useMemo(
    () => records.find((record) => record.id === selectedId) ?? records[0],
    [records, selectedId]
  );
  const filteredRecords = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      [record.title, record.subtitle, record.status, record.amount ?? "", ...Object.values(record.data ?? {})].join(" ").toLowerCase().includes(term)
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
      const updated = buildRecordFromDraft(module, draft, formState.record);
      setRecords((current) => current.map((record) => (record.id === updated.id ? updated : record)));
      setSelectedId(updated.id);
      setDetailRecord(updated);
      pushTransaction(`${module.label} record updated`);
      setFormState(null);
      const payload = await saveToApi(apiPath, "PATCH", updated);
      if (payload?.transactions) setTransactions(payload.transactions);
      return;
    }

    const draftRecord = buildRecordFromDraft(module, draft);
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
          fields={fields}
          onClose={() => setDetailRecord(null)}
          onEdit={() => setFormState({ mode: "edit", record: detailRecord })}
          onDelete={() => deleteSelected(detailRecord)}
          onStatus={(status) => {
            const updated = { ...detailRecord, status, data: { ...(detailRecord.data ?? {}), status } };
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
          fields={fields}
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
  fields,
  onClose,
  onEdit,
  onDelete,
  onStatus
}: {
  module: ModuleDefinition;
  record: ModuleRecord;
  fields: FieldDefinition[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (status: string) => void;
}) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-30 flex w-full max-w-[460px] -translate-x-1/2 items-end bg-black/55" onClick={onClose}>
      <section className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-[#34322f] bg-[#201f1d] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
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
        <div className="mt-3 grid gap-2">
          {fields.map((field) => {
            const value = record.data?.[field.key] ?? inferRecordValue(record, field.key);
            return value ? (
              <div key={field.key} className="rounded-md border border-[#4a4842] bg-[#151514] p-3">
                <div className="text-[11px] font-bold uppercase text-[#b9b0a3]">{field.label}</div>
                <div className="mt-1 text-sm font-semibold text-[#f6f1e8]">{value}</div>
              </div>
            ) : null;
          })}
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
  fields,
  state,
  onClose,
  onSave
}: {
  module: ModuleDefinition;
  fields: FieldDefinition[];
  state: { mode: "create" | "edit"; record?: ModuleRecord };
  onClose: () => void;
  onSave: (draft: DraftRecord) => void;
}) {
  const [draft, setDraft] = useState<DraftRecord>(() => recordToDraft(state.record, fields));

  function update(field: string, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="fixed inset-y-0 left-1/2 z-40 flex w-full max-w-[460px] -translate-x-1/2 items-end bg-black/55" onClick={onClose}>
      <form
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-[#34322f] bg-[#201f1d] p-4 shadow-2xl"
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
          {fields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={draft[field.key] ?? ""}
              onChange={(value) => update(field.key, value)}
            />
          ))}
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
  field,
  value,
  onChange
}: {
  field: FieldDefinition;
  value: string;
  onChange: (value: string) => void;
}) {
  if (field.type === "textarea") {
    return (
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
        {field.label}
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
          className="min-h-20 rounded-md border border-[#4a4842] bg-[#151514] px-3 py-2 text-sm normal-case text-[#f6f1e8] outline-none"
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
        {field.label}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
          className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8] outline-none"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
      {field.label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={field.type ?? "text"}
        required={field.required}
        className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8] outline-none"
      />
    </label>
  );
}
