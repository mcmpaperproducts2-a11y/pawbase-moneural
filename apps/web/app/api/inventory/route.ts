import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("inventory"); }
export function POST() { return createModuleRecord("inventory"); }
