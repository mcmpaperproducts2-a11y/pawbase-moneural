import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("admin"); }
export function POST() { return createModuleRecord("admin"); }
