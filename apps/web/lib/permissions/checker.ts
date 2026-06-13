import type { AuthUser } from "../../types/domain";
import type { PermissionAction } from "@pawbase/shared/constants/modules";

export function isSuperAdmin(user: Pick<AuthUser, "role"> | null | undefined) {
  return user?.role === "super_admin";
}

export function hasPermission(
  user: AuthUser | null | undefined,
  module: string,
  action: PermissionAction
) {
  if (!user || !user.isActive) {
    return false;
  }

  if (isSuperAdmin(user)) {
    return true;
  }

  const permission = user.permissions.find((item) => item.module === module);
  if (!permission) {
    return false;
  }

  return permission.actions.includes(action) || permission.actions.includes("manage");
}

export function visibleModules(user: AuthUser | null | undefined, modules: string[]) {
  return modules.filter((module) => hasPermission(user, module, "read") || hasPermission(user, module, "manage"));
}
