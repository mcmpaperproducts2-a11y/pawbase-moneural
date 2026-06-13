import { MODULES, type AppModule } from "@pawbase/shared/constants/modules";

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  roles: AdminRole[];
};

export type AdminModuleRow = {
  id: string;
  module_key: AppModule;
  display_name: string;
  sort_order: number;
};

export type AdminPermission = {
  role_id: string;
  module_id: string;
  can_create: boolean;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

export type AuditLog = {
  id: string;
  user_id: string;
  user_name: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  table_name: string;
  record_id: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
  created_at: string;
};

const roles: AdminRole[] = [
  { id: "role-super-admin", name: "super_admin", description: "Full platform access", is_system_role: true },
  { id: "role-manager", name: "manager", description: "Operational manager access", is_system_role: true },
  { id: "role-receptionist", name: "receptionist", description: "Front desk access", is_system_role: true },
  { id: "role-vet-staff", name: "vet_staff", description: "Health and care access", is_system_role: true },
  { id: "role-groomer", name: "groomer", description: "Care workflow access", is_system_role: true }
];

const modules: AdminModuleRow[] = MODULES.map((module, index) => ({
  id: `module-${module}`,
  module_key: module,
  display_name: module.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
  sort_order: index + 1
}));

let users: AdminUser[] = [
  {
    id: "usr_super_admin",
    email: "admin@example.com",
    full_name: "PawBase Super Admin",
    phone: "+919999999999",
    is_active: true,
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    roles: [roles[0]]
  }
];

let permissions: AdminPermission[] = roles.flatMap((role) =>
  modules.map((module) => {
    const full = role.name === "super_admin";
    const visible = full || role.name === "manager" || ["dashboard", "reservations", "owners", "pets", "checkin", "billing"].includes(module.module_key);
    return {
      role_id: role.id,
      module_id: module.id,
      can_create: full || visible,
      can_view: full || visible,
      can_edit: full || role.name === "manager",
      can_delete: full
    };
  })
);

let auditLogs: AuditLog[] = [
  {
    id: "audit-1",
    user_id: "usr_super_admin",
    user_name: "PawBase Super Admin",
    action: "INSERT",
    table_name: "users",
    record_id: "usr_super_admin",
    new_values: { email: "admin@example.com", role: "super_admin" },
    created_at: new Date().toISOString()
  }
];

export function listAdminUsers(query = "", status = "all") {
  const term = query.trim().toLowerCase();
  return users.filter((user) => {
    const matchesSearch = !term || [user.full_name, user.email, user.phone ?? "", ...user.roles.map((role) => role.name)].join(" ").toLowerCase().includes(term);
    const matchesStatus = status === "all" || (status === "active" ? user.is_active : !user.is_active);
    return matchesSearch && matchesStatus;
  });
}

export function getAdminUser(id: string) {
  return users.find((user) => user.id === id) ?? null;
}

export function createAdminUser(input: { email: string; full_name: string; phone?: string | null; role_ids: string[] }, actorId: string) {
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    return { error: "Email already in use", status: 409 as const };
  }
  const assignedRoles = roles.filter((role) => input.role_ids.includes(role.id));
  const user: AdminUser = {
    id: `usr-${Date.now()}`,
    email: input.email.toLowerCase(),
    full_name: input.full_name,
    phone: input.phone ?? null,
    is_active: true,
    last_login_at: null,
    created_at: new Date().toISOString(),
    roles: assignedRoles
  };
  users = [user, ...users];
  addAudit(actorId, "INSERT", "users", user.id, null, { email: user.email, full_name: user.full_name, roles: assignedRoles.map((role) => role.name) });
  return { user };
}

export function updateAdminUser(id: string, input: { full_name?: string; phone?: string | null; is_active?: boolean; role_ids?: string[] }, actorId: string) {
  const existing = getAdminUser(id);
  if (!existing) return { error: "User not found", status: 404 as const };
  if (id === actorId && input.is_active === false) return { error: "You cannot deactivate yourself", status: 400 as const };
  const oldValues = { ...existing, roles: existing.roles.map((role) => role.name) };
  const nextRoles = input.role_ids ? roles.filter((role) => input.role_ids?.includes(role.id)) : existing.roles;
  if (existing.roles.some((role) => role.name === "super_admin") && !nextRoles.some((role) => role.name === "super_admin") && superAdminCount() <= 1) {
    return { error: "Cannot remove the last super admin", status: 400 as const };
  }
  const updated = {
    ...existing,
    full_name: input.full_name ?? existing.full_name,
    phone: input.phone ?? existing.phone,
    is_active: input.is_active ?? existing.is_active,
    roles: nextRoles
  };
  users = users.map((user) => (user.id === id ? updated : user));
  addAudit(actorId, "UPDATE", "users", id, oldValues, { ...updated, roles: updated.roles.map((role) => role.name) });
  return { user: updated };
}

export function deactivateAdminUser(id: string, actorId: string) {
  if (id === actorId) return { error: "You cannot delete yourself", status: 400 as const };
  const existing = getAdminUser(id);
  if (!existing) return { error: "User not found", status: 404 as const };
  if (existing.roles.some((role) => role.name === "super_admin") && superAdminCount() <= 1) {
    return { error: "Cannot delete the last super admin", status: 400 as const };
  }
  return updateAdminUser(id, { is_active: false }, actorId);
}

export function listRoles() {
  return roles.map((role) => ({
    ...role,
    user_count: users.filter((user) => user.roles.some((userRole) => userRole.id === role.id)).length,
    permission_count: permissions.filter((permission) => permission.role_id === role.id && Object.values(permission).some(Boolean)).length
  }));
}

export function createRole(input: { name: string; description: string }) {
  if (roles.some((role) => role.name === input.name)) return { error: "Role already exists", status: 409 as const };
  const role: AdminRole = { id: `role-${Date.now()}`, name: input.name, description: input.description, is_system_role: false };
  roles.push(role);
  permissions.push(...modules.map((module) => ({ role_id: role.id, module_id: module.id, can_create: false, can_view: false, can_edit: false, can_delete: false })));
  return { role };
}

export function updateRole(id: string, input: { name?: string; description?: string }) {
  const role = roles.find((item) => item.id === id);
  if (!role) return { error: "Role not found", status: 404 as const };
  if (role.is_system_role) return { error: "System roles cannot be edited", status: 400 as const };
  role.name = input.name ?? role.name;
  role.description = input.description ?? role.description;
  return { role };
}

export function deleteRole(id: string) {
  const role = roles.find((item) => item.id === id);
  if (!role) return { error: "Role not found", status: 404 as const };
  if (role.is_system_role) return { error: "System roles cannot be deleted", status: 400 as const };
  if (users.some((user) => user.roles.some((userRole) => userRole.id === id))) return { error: "Role is assigned to users", status: 400 as const };
  permissions = permissions.filter((permission) => permission.role_id !== id);
  roles.splice(roles.indexOf(role), 1);
  return { ok: true };
}

export function getPermissionMatrix() {
  const matrix: Record<string, Record<string, Omit<AdminPermission, "role_id" | "module_id">>> = {};
  for (const permission of permissions) {
    matrix[permission.role_id] ??= {};
    matrix[permission.role_id][permission.module_id] = {
      can_create: permission.can_create,
      can_view: permission.can_view,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete
    };
  }
  return { roles: listRoles(), modules, matrix };
}

export function upsertPermission(input: AdminPermission) {
  const index = permissions.findIndex((permission) => permission.role_id === input.role_id && permission.module_id === input.module_id);
  if (index >= 0) permissions[index] = input;
  else permissions.push(input);
  return { ok: true };
}

export function listAuditLogs() {
  return auditLogs;
}

function superAdminCount() {
  return users.filter((user) => user.is_active && user.roles.some((role) => role.name === "super_admin")).length;
}

function addAudit(actorId: string, action: AuditLog["action"], tableName: string, recordId: string, oldValues: Record<string, unknown> | null, newValues: Record<string, unknown> | null) {
  const actor = getAdminUser(actorId);
  auditLogs = [
    {
      id: `audit-${Date.now()}`,
      user_id: actorId,
      user_name: actor?.full_name ?? "System",
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
      created_at: new Date().toISOString()
    },
    ...auditLogs
  ];
}
