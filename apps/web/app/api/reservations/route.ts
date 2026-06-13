import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("reservations"); }
export function POST(request: Request) { return createModuleRecord("reservations", request); }
export function PATCH(request: Request) { return updateModuleRecord("reservations", request); }
export function DELETE(request: Request) { return deleteModuleRecord("reservations", request); }
