import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("billing"); }
export function POST(request: Request) { return createModuleRecord("billing", request); }
export function PATCH(request: Request) { return updateModuleRecord("billing", request); }
export function DELETE(request: Request) { return deleteModuleRecord("billing", request); }
