import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("pets"); }
export function POST(request: Request) { return createModuleRecord("pets", request); }
export function PATCH(request: Request) { return updateModuleRecord("pets", request); }
export function DELETE(request: Request) { return deleteModuleRecord("pets", request); }
