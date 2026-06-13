import { ShieldCheck } from "lucide-react";
import type { AuthUser } from "@/types/domain";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function TopBar({ user }: { user: AuthUser }) {
  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur">
      <div>
        <div className="text-sm text-muted-foreground">Signed in as</div>
        <div className="font-semibold">{user.name}</div>
      </div>
      <div className="flex items-center gap-2">
        {user.role === "super_admin" ? (
          <span className="hidden items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:inline-flex">
            <ShieldCheck size={16} />
            All controls
          </span>
        ) : null}
        <LogoutButton />
      </div>
    </header>
  );
}
