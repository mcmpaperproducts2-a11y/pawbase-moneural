import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("care"); }
export function POST(request: Request) { return createModuleRecord("care", request); }
export function PATCH(request: Request) { return updateModuleRecord("care", request); }
export function DELETE(request: Request) { return deleteModuleRecord("care", request); }
