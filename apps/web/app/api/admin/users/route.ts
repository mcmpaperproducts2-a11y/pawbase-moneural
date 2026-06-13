import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("admin"); }
export function POST(request: Request) { return createModuleRecord("admin", request); }
export function PATCH(request: Request) { return updateModuleRecord("admin", request); }
export function DELETE(request: Request) { return deleteModuleRecord("admin", request); }
