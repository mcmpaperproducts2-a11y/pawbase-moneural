import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">PawBase ERP</p>
          <h1 className="mt-2 text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Access kennel operations, client records, billing, care tasks, and administration from one protected workspace.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
