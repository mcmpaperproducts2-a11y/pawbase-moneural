import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("checkin"); }
export function POST() { return createModuleRecord("checkin"); }
