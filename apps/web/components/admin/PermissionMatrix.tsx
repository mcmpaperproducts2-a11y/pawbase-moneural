"use client";

import { useEffect, useState } from "react";

type Role = { id: string; name: string; is_system_role: boolean; user_count?: number };
type ModuleRow = { id: string; module_key: string; display_name: string };
type Perms = { can_create: boolean; can_view: boolean; can_edit: boolean; can_delete: boolean };
type MatrixPayload = { roles: Role[]; modules: ModuleRow[]; matrix: Record<string, Record<string, Perms>> };
const actions: Array<keyof Perms> = ["can_create", "can_view", "can_edit", "can_delete"];

export function PermissionMatrix() {
  const [payload, setPayload] = useState<MatrixPayload | null>(null);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/permissions")
      .then((response) => response.json())
      .then(setPayload)
      .catch(() => setError("Unable to load permissions"));
  }

  useEffect(load, []);

  async function toggle(role: Role, module: ModuleRow, action: keyof Perms) {
    if (!payload || role.name === "super_admin") return;
    const current = payload.matrix[role.id]?.[module.id] ?? { can_create: false, can_view: false, can_edit: false, can_delete: false };
    const next = { ...current, [action]: !current[action] };
    setPayload({
      ...payload,
      matrix: { ...payload.matrix, [role.id]: { ...(payload.matrix[role.id] ?? {}), [module.id]: next } }
    });
    const response = await fetch("/api/admin/permissions", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role_id: role.id, module_id: module.id, ...next })
    });
    if (!response.ok) {
      setError("Permission save failed. Reload to restore server state.");
    }
  }

  if (!payload) return <div className="rounded-lg border border-[#34322f] bg-[#201f1d] p-4 text-sm font-semibold text-[#b9b0a3]">Loading permissions...</div>;

  return (
    <div className="grid gap-3">
      {error ? <div className="rounded-md border border-[#7a5a24] bg-[#2b2112] p-3 text-sm text-[#f4d59a]">{error}</div> : null}
      <div className="overflow-x-auto rounded-lg border border-[#34322f] bg-[#201f1d]">
        <table className="min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#34322f] text-left text-[#b9b0a3]">
              <th className="sticky left-0 bg-[#201f1d] p-3">Module</th>
              {payload.roles.map((role) => <th key={role.id} className="p-3">{role.name}<span className="ml-2 text-xs">({role.user_count ?? 0})</span></th>)}
            </tr>
          </thead>
          <tbody>
            {payload.modules.map((module) => (
              <tr key={module.id} className="border-b border-[#34322f]">
                <td className="sticky left-0 bg-[#201f1d] p-3 font-bold text-[#f6f1e8]">
                  {module.display_name}
                  <div className="text-xs font-semibold text-[#b9b0a3]">{module.module_key}</div>
                </td>
                {payload.roles.map((role) => {
                  const perms = payload.matrix[role.id]?.[module.id] ?? { can_create: false, can_view: false, can_edit: false, can_delete: false };
                  const count = actions.filter((action) => perms[action]).length;
                  return (
                    <td key={role.id} className={`p-3 ${count === 4 ? "bg-[#18382d]" : count ? "bg-[#3a3018]" : "bg-[#151514]"}`}>
                      <div className="flex gap-2">
                        {actions.map((action) => (
                          <label key={action} className="grid gap-1 text-center text-[10px] font-bold uppercase text-[#d7cfbf]">
                            {action.split("_")[1][0]}
                            <input type="checkbox" checked={role.name === "super_admin" || perms[action]} disabled={role.name === "super_admin"} onChange={() => toggle(role, module, action)} />
                          </label>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
