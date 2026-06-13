import { createModuleRecord, listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("kennel"); }
export function POST() { return createModuleRecord("kennel"); }
