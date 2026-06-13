import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { moduleDefinitions } from "@/lib/modules/definitions";
import { getModuleIcon } from "@/lib/modules/icons";
import { hasPermission } from "@/lib/permissions/checker";

export default async function AdminModulesPage() {
  const user = await getCurrentUser();
  const modules = moduleDefinitions.filter((module) => hasPermission(user, module.id, "read") || hasPermission(user, module.id, "manage"));

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-bold">All modules</h1>
        <p className="mt-2 text-sm text-muted-foreground">Every visible control for the current role, including all controls for super admins.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = getModuleIcon(module.icon);
          return (
            <Link key={module.id} href={module.href} className="rounded-md border border-border bg-white p-4 hover:border-primary">
              <Icon size={20} />
              <div className="mt-3 font-semibold">{module.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{module.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
