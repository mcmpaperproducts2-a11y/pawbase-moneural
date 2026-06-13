import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("care"); }
export function POST() { return createModuleRecord("care"); }
