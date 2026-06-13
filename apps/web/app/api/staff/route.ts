import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("staff"); }
export function POST() { return createModuleRecord("staff"); }
