import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { moduleDefinitions } from "@/lib/modules/definitions";
import { getModuleIcon } from "@/lib/modules/icons";
import { hasPermission } from "@/lib/permissions/checker";

const groups = [
  { title: "Operations", modules: ["dashboard", "reservations", "kennel", "checkin", "care"] },
  { title: "Client Records", modules: ["owners", "pets", "health"] },
  { title: "Business", modules: ["billing", "inventory", "staff", "reports"] },
  { title: "System", modules: ["admin"] }
];

export default async function AdminModulesPage() {
  const user = await getCurrentUser();
  const visibleModules = moduleDefinitions.filter((module) => hasPermission(user, module.id, "read") || hasPermission(user, module.id, "manage"));

  return (
    <div className="grid gap-5">
      <header className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
        <div className="text-xs font-bold uppercase text-[#34c084]">Navigation</div>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-[#f6f1e8]">All modules</h1>
        <p className="mt-2 text-sm leading-6 text-[#b9b0a3]">
          Quick access to every module available to your current role.
        </p>
      </header>

      <div className="grid gap-5">
        {groups.map((group) => {
          const modules = group.modules
            .map((id) => visibleModules.find((module) => module.id === id))
            .filter((module): module is (typeof visibleModules)[number] => Boolean(module));

          if (!modules.length) return null;

          return (
            <section key={group.title} className="grid gap-2">
              <h2 className="px-1 text-xs font-bold uppercase tracking-normal text-[#b9b0a3]">{group.title}</h2>
              <div className="grid gap-2">
                {modules.map((module) => {
                  const Icon = getModuleIcon(module.icon);
                  const canManage = hasPermission(user, module.id, "manage");
                  return (
                    <Link
                      key={module.id}
                      href={module.href}
                      className="flex items-center gap-3 rounded-lg border border-[#34322f] bg-[#201f1d] p-3 transition hover:border-[#34c084]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[#4a4842] bg-[#151514] text-[#34c084]">
                        <Icon size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-bold text-[#f6f1e8]">{module.label}</span>
                          {canManage ? (
                            <span className="rounded-md bg-[#18382d] px-2 py-0.5 text-[10px] font-bold uppercase text-[#9ce4bf]">All</span>
                          ) : null}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs font-semibold leading-5 text-[#b9b0a3]">
                          {module.summary}
                        </span>
                      </span>
                      <ChevronRight size={18} className="shrink-0 text-[#7d756a]" />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
