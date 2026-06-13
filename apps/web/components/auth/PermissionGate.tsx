import { hasPermission } from "@/lib/permissions/checker";
import type { AuthUser } from "@/types/domain";
import type { PermissionAction } from "@pawbase/shared/constants/modules";

type PermissionGateProps = {
  user: AuthUser | null;
  module: string;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGate({ user, module, action, children, fallback = null }: PermissionGateProps) {
  return hasPermission(user, module, action) ? <>{children}</> : <>{fallback}</>;
}
