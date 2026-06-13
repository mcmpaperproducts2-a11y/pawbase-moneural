import { DashboardClient } from "@/app/(app)/dashboard/DashboardClient";
import { getDashboardData } from "@/lib/dashboard/data";

export default async function DashboardPage() {
  const initialData = await getDashboardData();
  return <DashboardClient initialData={initialData} />;
}
