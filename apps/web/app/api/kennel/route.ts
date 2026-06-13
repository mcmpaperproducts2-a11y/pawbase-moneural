import { createModuleRecord, deleteModuleRecord, listModuleRecords, updateModuleRecord } from "@/lib/api/module-response";

export function GET() { return listModuleRecords("kennel"); }
export function POST(request: Request) { return createModuleRecord("kennel", request); }
export function PATCH(request: Request) { return updateModuleRecord("kennel", request); }
export function DELETE(request: Request) { return deleteModuleRecord("kennel", request); }
