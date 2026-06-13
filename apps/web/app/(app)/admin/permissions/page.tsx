import { PermissionMatrix } from "@/components/admin/PermissionMatrix";

export default function AdminPermissionsPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-bold">Permission matrix</h1>
        <p className="mt-1 text-sm text-[#b9b0a3]">Toggle Create, View, Edit, and Delete permissions by role and module.</p>
      </div>
      <PermissionMatrix />
    </div>
  );
}
