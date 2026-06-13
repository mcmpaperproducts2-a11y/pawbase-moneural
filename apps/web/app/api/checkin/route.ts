import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("checkin"); }
export function POST(request: Request) { return createModuleRecord("checkin", request); }
export function PATCH(request: Request) { return updateModuleRecord("checkin", request); }
export function DELETE(request: Request) { return deleteModuleRecord("checkin", request); }
