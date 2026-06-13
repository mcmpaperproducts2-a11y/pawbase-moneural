import { createServerSupabaseClient } from "@/lib/supabase/server";
import { findUserByEmail } from "@/lib/data/demo-users";
import { MODULES, type AppModule, type PermissionAction } from "@pawbase/shared/constants/modules";
import type { AuthUser, UserRole } from "@/types/domain";

type UserRow = {
  id: string;
  tenant_id?: string | null;
  email: string;
  full_name?: string | null;
  name?: string | null;
  role: UserRole;
  is_active?: boolean | null;
  password_hash: string;
};

type AuthUserWithHash = AuthUser & {
  passwordHash: string;
  tenantId?: string | null;
};

const allActions: PermissionAction[] = ["create", "read", "update", "delete", "manage"];
const managerActions: PermissionAction[] = ["create", "read", "update"];

const roleModules: Record<UserRole, AppModule[]> = {
  super_admin: [...MODULES],
  manager: MODULES.filter((module) => module !== "admin"),
  receptionist: ["dashboard", "reservations", "owners", "pets", "checkin", "billing"],
  vet_staff: ["dashboard", "pets", "care", "health", "checkin"],
  groomer: ["dashboard", "pets", "care", "checkin"]
};

function permissionsForRole(role: UserRole) {
  if (role === "super_admin") {
    return MODULES.map((module) => ({ module, actions: allActions }));
  }

  return roleModules[role].map((module) => ({
    module,
    actions: managerActions
  }));
}

function mapUserRow(row: UserRow): AuthUserWithHash {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    name: row.full_name ?? row.name ?? row.email,
    email: row.email,
    role: row.role,
    isActive: row.is_active ?? true,
    passwordHash: row.password_hash,
    permissions: permissionsForRole(row.role)
  };
}

export async function findLoginUser(email: string): Promise<AuthUserWithHash | null> {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("id, tenant_id, email, full_name, name, role, is_active, password_hash")
      .eq("email", email.toLowerCase())
      .maybeSingle<UserRow>();

    if (!error && data) {
      return mapUserRow(data);
    }
  }

  const demoUser = findUserByEmail(email);
  if (!demoUser) {
    return null;
  }

  const { passwordHash, ...safeUser } = demoUser;
  return { ...safeUser, passwordHash };
}
