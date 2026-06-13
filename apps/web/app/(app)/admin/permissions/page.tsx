import { PermissionGate } from "@/components/auth/PermissionGate";
import { getCurrentUser } from "@/lib/auth/session";
import { moduleDefinitions } from "@/lib/modules/definitions";

export default async function AdminPermissionsPage() {
  const user = await getCurrentUser();

  return (
    <PermissionGate user={user} module="admin" action="manage">
      <div className="grid gap-5">
        <div>
          <h1 className="text-2xl font-bold">Permission matrix</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Super admins automatically receive every control. Other roles are evaluated per module and action.
          </p>
        </div>
        <div className="overflow-x-auto rounded-md border border-border bg-white">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3">Module</th>
                <th className="p-3">Create</th>
                <th className="p-3">Read</th>
                <th className="p-3">Update</th>
                <th className="p-3">Delete</th>
                <th className="p-3">Manage</th>
              </tr>
            </thead>
            <tbody>
              {moduleDefinitions.map((module) => (
                <tr key={module.id} className="border-t border-border">
                  <td className="p-3 font-semibold">{module.label}</td>
                  {["create", "read", "update", "delete", "manage"].map((action) => (
                    <td key={action} className="p-3">
                      <input aria-label={`${module.label} ${action}`} type="checkbox" defaultChecked />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PermissionGate>
  );
}
