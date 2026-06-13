import bcrypt from "bcryptjs";
import type { AuthUser } from "../../types/domain";
import { MODULES, type AppModule, type PermissionAction } from "@pawbase/shared/constants/modules";

type DemoUser = AuthUser & {
  passwordHash: string;
};

const allActions: PermissionAction[] = ["create", "read", "update", "delete", "manage"];
const operationalActions: PermissionAction[] = ["create", "read", "update"];
const receptionistModules: AppModule[] = ["dashboard", "reservations", "owners", "pets", "checkin", "billing"];

export const demoUsers: DemoUser[] = [
  {
    id: "usr_super_admin",
    name: "PawBase Super Admin",
    email: "admin@example.com",
    role: "super_admin",
    isActive: true,
    passwordHash: bcrypt.hashSync("admin123", 12),
    permissions: MODULES.map((module) => ({ module, actions: allActions }))
  },
  {
    id: "usr_manager",
    name: "Kennel Manager",
    email: "manager@pawbase.app",
    role: "manager",
    isActive: true,
    passwordHash: bcrypt.hashSync("Manager@123!", 12),
    permissions: MODULES.filter((module) => module !== "admin").map((module) => ({
      module,
      actions: operationalActions
    }))
  },
  {
    id: "usr_reception",
    name: "Front Desk",
    email: "reception@pawbase.app",
    role: "receptionist",
    isActive: true,
    passwordHash: bcrypt.hashSync("Reception@123!", 12),
    permissions: receptionistModules.map((module) => ({
      module,
      actions: ["create", "read", "update"]
    }))
  }
];

export function findUserByEmail(email: string) {
  return demoUsers.find((user) => user.email === email.toLowerCase());
}
