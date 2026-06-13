import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { moduleDefinitions, primaryModules } from "@/lib/modules/definitions";
import { getModuleIcon } from "@/lib/modules/icons";
import { hasPermission } from "@/lib/permissions/checker";
import type { AuthUser } from "@/types/domain";

export function MobileNav({ user }: { user: AuthUser }) {
  const links = moduleDefinitions
    .filter((module) => primaryModules.includes(module.id))
    .filter((module) => hasPermission(user, module.id, "read") || hasPermission(user, module.id, "manage"));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto grid max-w-[460px] grid-cols-5 border-t border-[#34322f] bg-[#191918]/95 text-[#b9b0a3] backdrop-blur">
      {links.slice(0, 4).map((module) => {
        const Icon = getModuleIcon(module.icon);
        return (
          <Link key={module.id} href={module.href} className="grid min-h-16 place-items-center gap-1 px-1 py-2 text-xs font-bold hover:text-[#34c084]">
            <Icon size={19} />
            <span>{module.label}</span>
          </Link>
        );
      })}
      <Link href="/admin/modules" className="grid min-h-16 place-items-center gap-1 px-1 py-2 text-xs font-bold hover:text-[#34c084]">
        <MoreHorizontal size={19} />
        <span>More</span>
      </Link>
    </nav>
  );
}
