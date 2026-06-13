import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("reports"); }
export function POST(request: Request) { return createModuleRecord("reports", request); }
export function PATCH(request: Request) { return updateModuleRecord("reports", request); }
export function DELETE(request: Request) { return deleteModuleRecord("reports", request); }
