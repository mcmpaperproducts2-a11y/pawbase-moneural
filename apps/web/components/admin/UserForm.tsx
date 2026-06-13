"use client";

import { FormEvent, useEffect, useState } from "react";
import type { AdminRole, AdminUser } from "@/lib/admin/store";

type UserFormProps = {
  user?: AdminUser | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [roleIds, setRoleIds] = useState<string[]>(user?.roles.map((role) => role.id) ?? []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/roles")
      .then((response) => response.json())
      .then((payload: { data?: AdminRole[] }) => setRoles(payload.data ?? []))
      .catch(() => undefined);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const response = await fetch(user ? `/api/admin/users/${user.id}` : "/api/admin/users", {
      method: user ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email,
        phone,
        is_active: isActive,
        role_ids: roleIds
      })
    });
    setSaving(false);
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Unable to save user");
      return;
    }
    onSuccess();
  }

  function toggleRole(id: string) {
    setRoleIds((current) => (current.includes(id) ? current.filter((roleId) => roleId !== id) : [...current, id]));
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-lg border border-[#34322f] bg-[#201f1d] p-4">
      <h2 className="text-lg font-bold text-[#f6f1e8]">{user ? "Edit user" : "New user"}</h2>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
        Full name
        <input value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]" />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} required disabled={Boolean(user)} type="email" className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8] disabled:opacity-60" />
      </label>
      <label className="grid gap-1 text-xs font-bold uppercase text-[#b9b0a3]">
        Phone
        <input value={phone ?? ""} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] px-3 text-sm normal-case text-[#f6f1e8]" />
      </label>
      <div className="grid gap-2">
        <div className="text-xs font-bold uppercase text-[#b9b0a3]">Roles</div>
        {roles.map((role) => (
          <label key={role.id} className="flex items-center justify-between rounded-md border border-[#4a4842] bg-[#151514] px-3 py-2 text-sm font-semibold text-[#f6f1e8]">
            {role.name}
            <input type="checkbox" checked={roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
          </label>
        ))}
      </div>
      {user ? (
        <label className="flex items-center justify-between rounded-md border border-[#4a4842] bg-[#151514] px-3 py-2 text-sm font-semibold text-[#f6f1e8]">
          Active
          <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        </label>
      ) : null}
      {error ? <div className="rounded-md border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel} className="h-11 rounded-md border border-[#4a4842] bg-[#151514] font-bold text-[#f6f1e8]">Cancel</button>
        <button type="submit" disabled={saving} className="h-11 rounded-md bg-[#34c084] font-bold text-white disabled:opacity-60">{saving ? "Saving" : "Save"}</button>
      </div>
    </form>
  );
}
