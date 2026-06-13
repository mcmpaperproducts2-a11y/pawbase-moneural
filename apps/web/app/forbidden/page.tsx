import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="w-full max-w-md rounded-md border border-border bg-white p-6 text-center">
        <h1 className="text-2xl font-bold">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your role does not include permission for this control.</p>
        <Link href="/dashboard" className="mt-5 inline-flex h-11 items-center rounded-md bg-primary px-4 font-semibold text-primary-foreground">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
