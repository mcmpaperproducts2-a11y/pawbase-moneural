import { ShieldCheck } from "lucide-react";
import type { AuthUser } from "@/types/domain";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function TopBar({ user }: { user: AuthUser }) {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-[#34322f] bg-[#201f1d]/95 px-4 backdrop-blur">
      <div>
        <div className="text-xs font-bold uppercase text-[#34c084]">PawBase ERP</div>
        <div className="truncate font-semibold text-[#f6f1e8]">{user.name}</div>
      </div>
      <div className="flex items-center gap-2">
        {user.role === "super_admin" ? (
          <span className="hidden items-center gap-2 rounded-md border border-[#28634d] bg-[#18382d] px-3 py-2 text-sm font-semibold text-[#9ce4bf] sm:inline-flex">
            <ShieldCheck size={16} />
            All controls
          </span>
        ) : null}
        <LogoutButton />
      </div>
    </header>
  );
}
