export const MODULES = [
  "dashboard",
  "reservations",
  "owners",
  "pets",
  "kennel",
  "checkin",
  "care",
  "health",
  "billing",
  "staff",
  "inventory",
  "reports",
  "admin"
] as const;

export const ACTIONS = ["create", "read", "update", "delete", "manage"] as const;

export type AppModule = (typeof MODULES)[number];
export type PermissionAction = (typeof ACTIONS)[number];
