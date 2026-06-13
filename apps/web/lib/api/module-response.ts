import { NextResponse } from "next/server";
import { getModuleDefinition } from "@/lib/modules/definitions";

export function listModuleRecords(moduleId: string) {
  const module = getModuleDefinition(moduleId);
  if (!module) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ records: module.records, transactions: module.transactions });
}

export function createModuleRecord(moduleId: string) {
  const module = getModuleDefinition(moduleId);
  if (!module) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(
    {
      record: {
        id: `${moduleId}-${Date.now()}`,
        title: `${module.label} record`,
        subtitle: "Created through API",
        status: "new"
      }
    },
    { status: 201 }
  );
}

export function getModuleRecord(moduleId: string, id: string) {
  const module = getModuleDefinition(moduleId);
  const record = module?.records.find((item) => item.id === id) ?? module?.records[0];
  if (!module || !record) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ record, transactions: module.transactions });
}
