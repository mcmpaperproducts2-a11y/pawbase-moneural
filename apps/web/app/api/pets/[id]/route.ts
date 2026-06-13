import { getModuleRecord } from "@/lib/api/module-response";

export function GET(_request: Request, { params }: { params: { id: string } }) { return getModuleRecord("pets", params.id); }
