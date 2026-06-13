import { describe, expect, it } from "vitest";
import { loginSchema } from "../../packages/shared/schemas/auth";
import { findUserByEmail } from "../../apps/web/lib/data/demo-users";

describe("auth", () => {
  it("normalizes the configured super-admin login email", () => {
    const parsed = loginSchema.parse({ email: " ADMIN@EXAMPLE.COM ", password: "admin123" });
    expect(parsed.email).toBe("admin@example.com");
  });

  it("seeds the requested super-admin account", () => {
    const user = findUserByEmail("admin@example.com");
    expect(user?.role).toBe("super_admin");
    expect(user?.isActive).toBe(true);
  });
});
