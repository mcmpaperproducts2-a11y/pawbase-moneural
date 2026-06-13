"use client";

import { FormEvent, useEffect, useState } from "react";

type Role = { id: string; name: string; description: string; is_system_role: boolean; user_count: number; permission_count: number };

export function AdminRolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function load() {
    fetch("/api/admin/roles").then((response) => response.json()).then((payload: { data?: Role[] }) => setRoles(payload.data ?? []));
  }

  useEffect(load, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/admin/roles", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, description }) });
    setName("");
    setDescription("");
    load();
  }

  async function remove(role: Role) {
    await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-bold">Roles</h1>
        <p className="text-sm text-[#b9b0a3]">System roles are protected. Custom roles can be added and removed.</p>
      </div>
      <form onSubmit={create} className="grid gap-2 rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="custom_role" className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm text-[#f6f1e8]" required pattern="[a-z_]+" />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm text-[#f6f1e8]" required />
        <button className="h-11 rounded-md bg-[#34c084] font-bold text-white">New role</button>
      </form>
      <div className="grid gap-2">
        {roles.map((role) => (
          <div key={role.id} className="rounded-lg border border-[#34322f] bg-[#201f1d] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-[#f6f1e8]">{role.name}</div>
                <div className="mt-1 text-xs font-semibold text-[#b9b0a3]">{role.description}</div>
              </div>
              <span className="rounded-md bg-[#151514] px-2 py-1 text-xs font-bold text-[#d7cfbf]">{role.is_system_role ? "System" : "Custom"}</span>
            </div>
            <div className="mt-3 text-xs font-semibold text-[#b9b0a3]">{role.user_count} users · {role.permission_count} permissions</div>
            <button disabled={role.is_system_role || role.user_count > 0} onClick={() => remove(role)} className="mt-3 h-10 w-full rounded-md border border-[#774747] bg-[#392727] text-sm font-bold text-[#f3b5a9] disabled:opacity-40">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
