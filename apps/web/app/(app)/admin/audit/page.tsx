import { AuditTable } from "@/components/admin/AuditTable";

export default function AdminAuditPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-bold">Audit log</h1>
        <p className="mt-1 text-sm text-[#b9b0a3]">Review user, role, permission, and data changes.</p>
      </div>
      <AuditTable />
    </div>
  );
}
