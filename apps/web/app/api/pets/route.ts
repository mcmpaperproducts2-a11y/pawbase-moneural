import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("pets"); }
export function POST() { return createModuleRecord("pets"); }
