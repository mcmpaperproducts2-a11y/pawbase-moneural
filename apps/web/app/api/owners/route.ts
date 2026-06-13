import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("owners"); }
export function POST() { return createModuleRecord("owners"); }
