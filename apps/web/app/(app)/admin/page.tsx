import Link from "next/link";
import { Activity, KeyRound, ShieldCheck, Users } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { getCurrentUser } from "@/lib/auth/session";

const cards = [
  { href: "/admin/users", title: "Users", description: "Create users, activate accounts, and assign roles.", icon: Users, badge: "Manage team" },
  { href: "/admin/roles", title: "Roles", description: "Create custom roles and protect system roles.", icon: ShieldCheck, badge: "Role library" },
  { href: "/admin/permissions", title: "Permissions", description: "Configure role access across every PawBase module.", icon: KeyRound, badge: "Configure access" },
  { href: "/admin/audit", title: "Audit", description: "Review recent access and data changes.", icon: Activity, badge: "Last 24h events" }
];

export default async function AdminPage() {
  const user = await getCurrentUser();
  return (
    <PermissionGate user={user} module="admin" action="manage" fallback={<div>Access denied</div>}>
      <div className="grid gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="mt-1 text-sm text-[#b9b0a3]">Control users, roles, permissions, and audit visibility.</p>
        </div>
        <div className="grid gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.href} href={card.href} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
                <div className="flex items-start justify-between gap-3">
                  <Icon size={22} className="text-[#34c084]" />
                  <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{card.badge}</span>
                </div>
                <div className="mt-3 font-bold text-[#f6f1e8]">{card.title}</div>
                <p className="mt-1 text-sm text-[#b9b0a3]">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </PermissionGate>
  );
}
