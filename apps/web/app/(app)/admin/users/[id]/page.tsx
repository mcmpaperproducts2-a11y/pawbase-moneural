import Link from "next/link";
import { getAdminUser, listAuditLogs } from "@/lib/admin/store";

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = getAdminUser(params.id);
  if (!user) return <div>User not found</div>;
  const activity = listAuditLogs().filter((row) => row.user_id === user.id || row.record_id === user.id).slice(0, 10);
  return (
    <div className="grid gap-4">
      <Link href="/admin/users" className="text-sm font-bold text-[#34c084]">Back to users</Link>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
        <div className="text-2xl font-bold text-[#f6f1e8]">{user.full_name}</div>
        <div className="mt-1 text-sm font-semibold text-[#b9b0a3]">{user.email} · {user.phone ?? "No phone"}</div>
        <div className="mt-3 flex flex-wrap gap-2">{user.roles.map((role) => <span key={role.id} className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold">{role.name}</span>)}</div>
      </section>
      <section className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
        <h2 className="font-bold">Activity</h2>
        <div className="mt-3 grid gap-2">
          {activity.map((row) => <div key={row.id} className="rounded-md bg-[#151514] p-3 text-sm">{row.action} {row.table_name} · {new Date(row.created_at).toLocaleString()}</div>)}
          {!activity.length ? <div className="text-sm text-[#b9b0a3]">No recent activity.</div> : null}
        </div>
      </section>
    </div>
  );
}
