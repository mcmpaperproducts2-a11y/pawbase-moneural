export type TenantSample = {
  id: string;
  name: string;
  plan: "starter" | "growth" | "enterprise";
  region: string;
  occupancy: string;
  revenueMonthToDate: string;
  users: number;
  petsBoarding: number;
};

export const sampleTenants: TenantSample[] = [
  {
    id: "tenant_pawbase_blr",
    name: "PawBase Bengaluru",
    plan: "enterprise",
    region: "India South",
    occupancy: "18 / 24",
    revenueMonthToDate: "₹3.2L",
    users: 24,
    petsBoarding: 18
  },
  {
    id: "tenant_pawbase_mum",
    name: "PawBase Mumbai",
    plan: "growth",
    region: "India West",
    occupancy: "11 / 18",
    revenueMonthToDate: "₹1.8L",
    users: 16,
    petsBoarding: 11
  },
  {
    id: "tenant_pawbase_del",
    name: "PawBase Delhi",
    plan: "starter",
    region: "India North",
    occupancy: "7 / 12",
    revenueMonthToDate: "₹92k",
    users: 8,
    petsBoarding: 7
  }
];

export const sampleOwners = [
  { tenantId: "tenant_pawbase_blr", name: "Asha Rao", pets: ["Bruno", "Coco"], balance: "₹0" },
  { tenantId: "tenant_pawbase_blr", name: "Kabir Menon", pets: ["Rio"], balance: "₹7,200" },
  { tenantId: "tenant_pawbase_mum", name: "Neha Shah", pets: ["Mochi", "Luna"], balance: "₹4,820" },
  { tenantId: "tenant_pawbase_del", name: "Ira Kapoor", pets: ["Tuna"], balance: "₹0" }
];

export const sampleReservations = [
  { tenantId: "tenant_pawbase_blr", code: "BLR-1042", pet: "Bruno", unit: "A-03", status: "checked_in", total: "₹8,400" },
  { tenantId: "tenant_pawbase_blr", code: "BLR-1043", pet: "Rio", unit: "B-07", status: "confirmed", total: "₹7,200" },
  { tenantId: "tenant_pawbase_mum", code: "MUM-2201", pet: "Mochi", unit: "C-01", status: "checked_in", total: "₹4,820" },
  { tenantId: "tenant_pawbase_del", code: "DEL-3107", pet: "Tuna", unit: "Cat-02", status: "waitlisted", total: "₹3,600" }
];
