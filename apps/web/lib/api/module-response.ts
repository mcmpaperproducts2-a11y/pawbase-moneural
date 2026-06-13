import { NextResponse } from "next/server";
import { getModuleDefinition, type ModuleDefinition } from "@/lib/modules/definitions";

type ModuleRecord = ModuleDefinition["records"][number];
type ModuleTransaction = ModuleDefinition["transactions"][number];
type ModuleStore = {
  records: ModuleRecord[];
  transactions: ModuleTransaction[];
};

const stores = new Map<string, ModuleStore>();

function getStore(moduleId: string) {
  const module = getModuleDefinition(moduleId);
  if (!module) return null;

  if (!stores.has(moduleId)) {
    stores.set(moduleId, {
      records: module.records.map((record) => ({ ...record })),
      transactions: module.transactions.map((transaction) => ({ ...transaction }))
    });
  }

  return stores.get(moduleId) ?? null;
}

function pushTransaction(store: ModuleStore, moduleId: string, label: string) {
  store.transactions = [
    {
      id: `${moduleId}-tx-${Date.now()}`,
      label,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      by: "API"
    },
    ...store.transactions
  ].slice(0, 12);
}

async function readBody(request?: Request) {
  if (!request) return {};
  return (await request.json().catch(() => ({}))) as Partial<ModuleRecord> & { id?: string };
}

export function listModuleRecords(moduleId: string) {
  const store = getStore(moduleId);
  if (!store) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(store);
}

export async function createModuleRecord(moduleId: string, request?: Request) {
  const module = getModuleDefinition(moduleId);
  const store = getStore(moduleId);
  if (!module || !store) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await readBody(request);
  const record: ModuleRecord = {
    id: `${moduleId}-${Date.now()}`,
    title: body.title || `${module.label} record ${store.records.length + 1}`,
    subtitle: body.subtitle || "Created through API",
    status: body.status || "new",
    amount: body.amount
  };
  store.records = [record, ...store.records];
  pushTransaction(store, moduleId, `${record.title} created`);
  return NextResponse.json({ record, transactions: store.transactions }, { status: 201 });
}

export function getModuleRecord(moduleId: string, id: string) {
  const store = getStore(moduleId);
  const record = store?.records.find((item) => item.id === id) ?? store?.records[0];
  if (!store || !record) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ record, transactions: store.transactions });
}

export async function updateModuleRecord(moduleId: string, request: Request) {
  const store = getStore(moduleId);
  if (!store) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await readBody(request);
  if (!body.id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const existing = store.records.find((record) => record.id === body.id);
  if (!existing) {
    return NextResponse.json({ error: "record_not_found" }, { status: 404 });
  }

  const updated: ModuleRecord = {
    ...existing,
    title: body.title ?? existing.title,
    subtitle: body.subtitle ?? existing.subtitle,
    status: body.status ?? existing.status,
    amount: body.amount ?? existing.amount
  };
  store.records = store.records.map((record) => (record.id === updated.id ? updated : record));
  pushTransaction(store, moduleId, `${updated.title} updated`);
  return NextResponse.json({ record: updated, transactions: store.transactions });
}

export async function deleteModuleRecord(moduleId: string, request: Request) {
  const store = getStore(moduleId);
  if (!store) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await readBody(request);
  if (!body.id) {
    return NextResponse.json({ error: "missing_id" }, { status: 400 });
  }

  const existing = store.records.find((record) => record.id === body.id);
  if (!existing) {
    return NextResponse.json({ error: "record_not_found" }, { status: 404 });
  }

  store.records = store.records.filter((record) => record.id !== body.id);
  pushTransaction(store, moduleId, `${existing.title} deleted`);
  return NextResponse.json({ records: store.records, transactions: store.transactions });
}
