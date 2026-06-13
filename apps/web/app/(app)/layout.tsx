import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar user={user} />
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">
        <TopBar user={user} />
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
      </div>
      <MobileNav user={user} />
    </div>
  );
}
