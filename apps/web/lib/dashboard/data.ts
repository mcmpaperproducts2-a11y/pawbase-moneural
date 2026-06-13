export type DashboardData = {
  occupancy: { current: number; total: number; pct: number; free: number; maintenance: number };
  checkins_today: Array<{ id: string; pet: string; breed: string; owner: string; unit: string; time: string }>;
  checkouts_today: Array<{ id: string; pet: string; owner: string; unit: string; time: string }>;
  current_boarders: Array<{ id: string; pet: string; breed: string; species: string; owner: string; unit: string; check_out_date: string }>;
  revenue_today: number;
  pending_invoices: { count: number; amount: number };
  vaccination_alerts: Array<{ id: string; pet: string; owner: string; vaccine_name: string; expiry_date: string }>;
  upcoming_reservations: Array<{ id: string; pet: string; owner: string; check_in_date: string; check_out_date: string }>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const total = 24;
  const current = 18;
  return {
    occupancy: { current, total, pct: Math.round((current / total) * 100), free: total - current, maintenance: 2 },
    checkins_today: [
      { id: "res-1042", pet: "Bailey", breed: "Golden Retriever", owner: "Asha Rao", unit: "Garden Suite 04", time: "10:00" },
      { id: "res-1045", pet: "Rio", breed: "Indie dog", owner: "Meera Nair", unit: "Deluxe 11", time: "14:30" }
    ],
    checkouts_today: [
      { id: "res-1043", pet: "Milo", owner: "Kabir Menon", unit: "Cat Condo 02", time: "16:00" }
    ],
    current_boarders: [
      { id: "res-1042", pet: "Bailey", breed: "Golden Retriever", species: "dog", owner: "Asha Rao", unit: "Garden Suite 04", check_out_date: "2026-06-18" },
      { id: "res-1043", pet: "Milo", breed: "Persian cat", species: "cat", owner: "Kabir Menon", unit: "Cat Condo 02", check_out_date: "2026-06-16" }
    ],
    revenue_today: 4820,
    pending_invoices: { count: 3, amount: 42800 },
    vaccination_alerts: [
      { id: "vac-1", pet: "Luna", owner: "Neha Shah", vaccine_name: "DHPP", expiry_date: "2026-06-20" },
      { id: "vac-2", pet: "Coco", owner: "Priya Sharma", vaccine_name: "Rabies", expiry_date: "2026-06-25" }
    ],
    upcoming_reservations: [
      { id: "res-1047", pet: "Coco", owner: "Priya Sharma", check_in_date: "2026-06-15", check_out_date: "2026-06-19" },
      { id: "res-1048", pet: "Bruno", owner: "Sharma family", check_in_date: "2026-06-17", check_out_date: "2026-06-22" }
    ]
  };
}
