import { listModuleRecords } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("reports"); }
