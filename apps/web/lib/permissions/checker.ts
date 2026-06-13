import type { AuthUser } from "../../types/domain";
import type { PermissionAction } from "@pawbase/shared/constants/modules";

export type MatrixAction = "can_view" | "can_create" | "can_edit" | "can_delete";

export function matrixActionToPermission(action: MatrixAction): PermissionAction {
  if (action === "can_view") return "read";
  if (action === "can_create") return "create";
  if (action === "can_edit") return "update";
  return "delete";
}

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

export async function checkPermission(
  user: AuthUser | null | undefined,
  module: string,
  action: PermissionAction | MatrixAction
) {
  const normalized = action.startsWith("can_") ? matrixActionToPermission(action as MatrixAction) : (action as PermissionAction);
  return hasPermission(user, module, normalized) || hasPermission(user, module, "manage");
}
