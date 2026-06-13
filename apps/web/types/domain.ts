import type { AppModule, PermissionAction } from "@pawbase/shared/constants/modules";

export type UserRole = "super_admin" | "manager" | "receptionist" | "vet_staff" | "groomer";

export type Permission = {
  module: AppModule;
  actions: PermissionAction[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  permissions: Permission[];
};

export type SessionPayload = {
  user: AuthUser;
  exp: number;
};
