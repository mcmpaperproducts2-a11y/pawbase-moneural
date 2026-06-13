"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserForm } from "@/components/admin/UserForm";
import type { AdminUser } from "@/lib/admin/store";

export function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<AdminUser | null | undefined>(undefined);

  function load() {
    fetch(`/api/admin/users?q=${encodeURIComponent(query)}&status=${status}`)
      .then((response) => response.json())
      .then((payload: { data?: AdminUser[] }) => setUsers(payload.data ?? []))
      .catch(() => undefined);
  }

  useEffect(load, [query, status]);

  async function deactivate(user: AdminUser) {
    await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-[#b9b0a3]">Create users, assign roles, and manage access.</p>
        </div>
        <button onClick={() => setEditing(null)} className="rounded-md bg-[#34c084] px-3 py-2 text-sm font-bold text-white">New user</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users" className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm text-[#f6f1e8]" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm text-[#f6f1e8]">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {editing !== undefined ? <UserForm user={editing} onCancel={() => setEditing(undefined)} onSuccess={() => { setEditing(undefined); load(); }} /> : null}
      <div className="grid gap-2">
        {users.map((user) => (
          <div key={user.id} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/users/${user.id}`} className="min-w-0">
                <div className="font-bold text-[#f6f1e8]">{user.full_name}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{user.email}</div>
              </Link>
              <span className={`rounded-md px-2 py-1 text-xs font-bold ${user.is_active ? "bg-[#18382d] text-[#9ce4bf]" : "bg-[#392727] text-[#f3b5a9]"}`}>{user.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.roles.map((role) => <span key={role.id} className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{role.name}</span>)}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setEditing(user)} className="h-10 rounded-md border border-[#4a4842] bg-[#151514] text-sm font-bold text-[#f6f1e8]">Edit</button>
              <button onClick={() => deactivate(user)} className="h-10 rounded-md border border-[#774747] bg-[#392727] text-sm font-bold text-[#f3b5a9]">Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
