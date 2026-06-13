import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md rounded-md border border-border bg-white p-6">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we will send a reset link if the account exists.</p>
        <ForgotPasswordForm />
      </section>
    </main>
  );
}
