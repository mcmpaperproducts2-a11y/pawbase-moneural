import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("reservations"); }
export function POST() { return createModuleRecord("reservations"); }
