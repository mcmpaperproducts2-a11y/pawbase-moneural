"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="grid h-11 w-11 place-items-center rounded-md border border-border bg-white text-slate-700 hover:bg-muted"
      type="button"
      onClick={logout}
      aria-label="Sign out"
      title="Sign out"
    >
      <LogOut size={18} />
    </button>
  );
}
