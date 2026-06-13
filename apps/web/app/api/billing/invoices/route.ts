import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("billing"); }
export function POST() { return createModuleRecord("billing"); }
