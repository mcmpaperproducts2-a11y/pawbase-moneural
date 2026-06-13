import { describe, expect, it } from "vitest";
import { hasPermission, isSuperAdmin, visibleModules } from "../../apps/web/lib/permissions/checker";
import type { AuthUser } from "../../apps/web/types/domain";

const superAdmin: AuthUser = {
  id: "usr_super_admin",
  name: "Admin",
  email: "admin@example.com",
  role: "super_admin",
  isActive: true,
  permissions: []
};

const receptionist: AuthUser = {
  id: "usr_reception",
  name: "Reception",
  email: "reception@pawbase.app",
  role: "receptionist",
  isActive: true,
  permissions: [{ module: "reservations", actions: ["read", "create"] }]
};

describe("permissions", () => {
  it("gives super admins access to every control", () => {
    expect(isSuperAdmin(superAdmin)).toBe(true);
    expect(hasPermission(superAdmin, "admin", "manage")).toBe(true);
    expect(hasPermission(superAdmin, "billing", "delete")).toBe(true);
  });

  it("limits non-super-admin users to assigned modules", () => {
    expect(hasPermission(receptionist, "reservations", "read")).toBe(true);
    expect(hasPermission(receptionist, "admin", "manage")).toBe(false);
  });

  it("shows all modules to super admins", () => {
    expect(visibleModules(superAdmin, ["dashboard", "admin", "billing"])).toEqual(["dashboard", "admin", "billing"]);
  });
});
