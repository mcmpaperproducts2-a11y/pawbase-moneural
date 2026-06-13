import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md rounded-md border border-border bg-white p-6">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a new password for your PawBase account.</p>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </main>
  );
}
