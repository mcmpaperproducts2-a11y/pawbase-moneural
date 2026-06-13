import Link from "next/link";
import { PawPrint } from "lucide-react";
import { moduleDefinitions } from "@/lib/modules/definitions";
import { getModuleIcon } from "@/lib/modules/icons";
import { hasPermission } from "@/lib/permissions/checker";
import type { AuthUser } from "@/types/domain";

export function Sidebar({ user }: { user: AuthUser }) {
  const links = moduleDefinitions.filter((module) => hasPermission(user, module.id, "read") || hasPermission(user, module.id, "manage"));

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
          <PawPrint size={22} />
        </span>
        <div>
          <div className="font-bold">PawBase</div>
          <div className="text-xs text-muted-foreground">{user.role}</div>
        </div>
      </div>
      <nav className="grid gap-1 p-3">
        {links.map((module) => {
          const Icon = getModuleIcon(module.icon);
          return (
            <Link
              key={module.id}
              href={module.href}
              className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-muted"
            >
              <Icon size={18} />
              {module.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
