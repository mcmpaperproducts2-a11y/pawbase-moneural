import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#1b1b1a] text-[#f6f1e8]">
      <div className="mx-auto min-h-screen max-w-[460px] bg-[#111110] shadow-2xl">
        <TopBar user={user} />
        <main className="px-4 pb-28 pt-4">{children}</main>
        <MobileNav user={user} />
      </div>
    </div>
  );
}
